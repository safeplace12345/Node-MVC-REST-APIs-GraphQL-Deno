const express = require("express");
const router = express.Router();
const path = require("path");
// All redirect to /admin/...
const adminController = require('../controllers/admin')

router.get("/add-product", adminController.getAddProductsPage);
// router.get("/add-product/:prodID", adminController.editProductsPage);
router.post("/products", adminController.postProductsPage);
router.get('/productsList',adminController.getAllAdminProducts)
// router.post('/delete',adminController.deleteProduct)

// configure router 
// router.post('/edit-product',adminController.editProductPage)

module.exports = { router };
