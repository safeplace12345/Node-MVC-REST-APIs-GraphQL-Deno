const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../utils/path");
const adminRoutes = require("./admin");
router.get("/", (req, res, next) => {
  const products = adminRoutes.products;
  console.log(products);
  res.render("shop", {
    products,
    path: "/shop",
    hasProducts: products.length > 0,
    activeShop : true,
    prodCss : true
  });
});
module.exports = router;
