const express = require("express");
const router = express.Router();
const path = require("path");
// All redirect to /admin/...
const adminController = require('../controllers/admin')
// Method => GEt
router.get("/add-product", adminController.getAddProductsPage);
// Method =>GET with PARAMS
router.get("/add-product/:prodID", adminController.editProductsPage);
// Method => POST
router.post("/products", adminController.postProductsPage);
// Method => GET
router.get('/productsList',adminController.getAllAdminProducts)
router.post('/delete',adminController.deleteProduct)
// Method => POST
router.post('/edit-product',adminController.editProductPage)

module.exports = { router };
