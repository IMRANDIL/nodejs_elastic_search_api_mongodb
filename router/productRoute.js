const router = require("express").Router();
const productController = require("../controller/productController");
// Create the index and define mapping
router.post("/products/createIndex", productController.createIndex);

// Search products
router.get("/products/search", productController.searchProducts);

module.exports = router;
