const express = require("express");
const router = express.Router();
const path = require('path')
const rootDir = require("../utils/path");
const adminProducts = require('./admin')
router.get("/", (req, res, next) => { 
  res.render('shop',{pageTitle : 'Shop', path:'/' , products : adminProducts.products})
});
module.exports = router;
