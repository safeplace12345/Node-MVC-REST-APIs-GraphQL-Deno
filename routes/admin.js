const express = require("express");
const router = express.Router();
// All redirect to /admin/...
const adminController = require("../controllers/admin");

const { check, body } = require("express-validator/check");
// Authentication middleware
const isAuth = require("../middleware/is-auth");
// Method => GEt add product page
router.get("/add-product", isAuth, adminController.getAddProductsPage);
// Method =>GET with PARAMS edit product page
router.get("/add-product/:prodID", isAuth, adminController.editProductsPage);
// Method => POST add product
router.post(
    "/products",
    [
        body("title", "Title cannot be less than 3 characters")
            .isLength({ min: 3 })
            .trim(),
        check("_csrf", "Invalid crsf tokens"),
        check("price", "Only intergers allowed for prices").isFloat().trim(),
        check("description", "Description too short")
            .trim()
            .isLength({ min: 6 }),
    ],
    isAuth,
    adminController.postProductsPage
);
// Method => GET
router.get("/productsList", adminController.getAllAdminProducts);
router.post("/delete",body("productID").trim(), isAuth, adminController.deleteProduct);
// Method => POST edit product
router.post(
    "/edit-product",
    [
        body("title", "Title cannot be less than 3 characters")
            .isLength({ min: 3 })
            .trim(),
        check("price", "Only intergers allowed for prices").isFloat().trim(),
        check("description", "Description too short")
            .trim()
            .isLength({ min: 6 }),
    ],
    isAuth,
    adminController.editProductPage
);

module.exports = { router };
