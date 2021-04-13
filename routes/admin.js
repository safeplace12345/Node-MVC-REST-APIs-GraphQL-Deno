const express = require("express");
const router = express.Router();
const path = require("path");
// All redirect to /admin/...

const products = [];
router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
  });
  // this is one way of using the path
});
router.post("/products", (req, res, next) => {
  const product = JSON.parse(JSON.stringify(req.body));
  products.push(product);
  res.redirect("/");
});

module.exports = { router, products };
