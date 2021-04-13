const express = require("express");
const router = express.Router();
const path = require("path");
// All redirect to /admin/...
const productsController = require('../controllers/products')

router.get("/add-product", productsController.getAddProductsPage);
router.post("/products", productsController.getProductsPage);

module.exports = { router };
