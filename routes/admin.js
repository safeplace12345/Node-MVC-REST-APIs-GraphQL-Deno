const express = require('express')
const router = express.Router();
const path = require('path')
// All redirect to /admin/...
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(__dirname, '..' , 'views' , 'add-product.html')) 
  // this is one way of using the path
});
router.post("/products", (req, res, next) => {
  res.redirect('/')
});

module.exports = router;