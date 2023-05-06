const { Client } = require("@elastic/elasticsearch");
const Product = require("../models/product.model");

// Create an instance of the Elasticsearch client
const client = new Client({
  node: process.env.ELASTIC_URI, // Elasticsearch server URL
});

// Create index and define mapping
const createIndex = async () => {
  try {
    const { body: indexExists } = await client.indices.exists({
      index: "products", // Index name (you can change it accordingly)
    });

    if (!indexExists) {
      await client.indices.create({
        index: "products", // Index name (you can change it accordingly)
        body: {
          mappings: {
            properties: {
              id: { type: "integer" },
              name: { type: "text" },
              description: { type: "text" },
              // Add other fields from your Product schema here
            },
          },
        },
      });

      console.log("Index created successfully");
    } else {
      console.log("Index already exists");
    }
  } catch (error) {
    console.error("Error creating index:", error);
  }
};

// Search products
const searchProducts = async (req, res) => {
  const searchTerm = req.query.q; // Get the search term from the request query parameter
  const sortBy = req.query.sortBy; // Get the sorting field from the request query parameter
  const filter = req.query.filter; // Get the filter value from the request query parameter

  try {
    const { body } = await client.search({
      index: "products", // Index name in Elasticsearch (you can change it accordingly)
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
            filter: filter ? { term: { category: filter } } : undefined, // Add filter condition if provided
          },
        },
        sort: sortBy ? [{ [sortBy]: "asc" }] : undefined, // Add sorting if provided
      },
    });

    const products = body.hits.hits.map((hit) => hit._source);

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createIndex,
  searchProducts,
};
