require("../config/dbConfig");
const Product = require("../models/product.model");
const data = require("../mockData.json");

const productBulkInsert = async () => {
  try {
    await Product.insertMany(data);
    console.log("Bulk insertion completed");
    process.exit(); // Exit the process
  } catch (error) {
    console.log("Bulk insertion failed");
  }
};

productBulkInsert();
