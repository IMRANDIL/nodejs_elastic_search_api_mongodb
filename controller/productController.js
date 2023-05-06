const { Client } = require("@elastic/elasticsearch");
const Product = require("../models/product.model");

// Create an instance of the Elasticsearch client
const client = new Client({
  node: process.env.ELASTIC_URI, // Elasticsearch server URL
});

// Create index and define mapping
const createIndex = async (req, res) => {
  try {
    const { body: indexExists } = await client.indices.exists({
      index: "products", // Index name (you can change it accordingly)
    });

    if (indexExists) {
      return res.send("Index already exists");
    }

    await client.indices.create({
      index: "products", // Index name (you can change it accordingly)
      body: {
        mappings: {
          properties: {
            id: { type: "integer" },
            name: { type: "keyword" },
            description: { type: "keyword" },
            // Add other fields from your Product schema here
          },
        },
      },
    });

    res.send("Index created successfully");
  } catch (error) {
    if (
      error.statusCode === 400 &&
      error.meta?.body?.error?.type === "resource_already_exists_exception"
    ) {
      return res.send("Index already exists");
    }

    console.error("Error creating index:", error);
    res.status(500).send("Failed to create index");
  }
};

// Search products
const searchProducts = async (req, res) => {
  const searchTerm = req.query.q;
  const sortBy = req.query.sortBy;
  const filter = req.query.filter;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    let query = {};

    if (searchTerm) {
      const { body } = await client.search({
        index: "products",
        body: {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: searchTerm,
                    fields: ["name", "description"],
                    type: "phrase",
                  },
                },
              ],
            },
          },
          sort: sortBy ? [{ [sortBy]: "asc" }] : undefined,
        },
      });

      const hits = body && body.hits && body.hits.hits;
      const productIds = hits ? hits.map((hit) => hit._id) : [];

      query = { _id: { $in: productIds } };
    } else if (filter) {
      const filterValues = filter.split(",").map((value) => value.trim());
      const filterQueries = filterValues.map((value) => ({
        $or: [
          { name: { $regex: value, $options: "i" } },
          { description: { $regex: value, $options: "i" } },
        ],
      }));
      query = { $or: filterQueries };
    }

    // Count the total number of products matching the search criteria
    const count = await Product.countDocuments(query);

    // Retrieve paginated products from the MongoDB database using the Product model
    let productsQuery = Product.find(query).skip(skip).limit(limit);

    if (sortBy) {
      const sortOption = {};
      sortOption[sortBy] = "DESC";
      productsQuery = productsQuery.sort(sortOption);
    }

    const products = await productsQuery;

    res.json({
      total: count,
      page,
      limit,
      data: products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createIndex,
  searchProducts,
};
