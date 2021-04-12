const express = require('express')
const router = express.Router();
const path = require('path')

const products = []
// All redirect to /admin/...
router.get("/add-product", (req, res, next) => {
  res.render('add-product') 
  // this is one way of using the path
});
router.post("/products", (req, res, next) => {
  products.push({product : req.body})
  res.redirect('/')
});

module.exports = {
  router,
  products
};