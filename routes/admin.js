const express = require("express");
const router = express.Router();
// All redirect to /admin/...
const adminController = require("../controllers/admin");

// Authentication middleware
const isAuth = require("../middleware/is-auth");
// Method => GEt
router.get("/add-product", isAuth, adminController.getAddProductsPage);
// Method =>GET with PARAMS
router.get("/add-product/:prodID", isAuth, adminController.editProductsPage);
// Method => POST
router.post("/products", isAuth, adminController.postProductsPage);
// Method => GET
router.get("/productsList", adminController.getAllAdminProducts);
router.post("/delete", isAuth, adminController.deleteProduct);
// Method => POST
router.post("/edit-product", isAuth, adminController.editProductPage);

module.exports = { router };
