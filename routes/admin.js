const express = require("express");
const router = express.Router();
const path = require("path");

const products = [];
// All redirect to /admin/...
router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
    activeProd: true,
    prodCss: true,
  });
  // this is one way of using the path
});
router.post("/products", (req, res, next) => {
  products.push(JSON.parse(JSON.stringify(req.body)));
  res.redirect("/");
});

module.exports = {
  router,
  products,
};
