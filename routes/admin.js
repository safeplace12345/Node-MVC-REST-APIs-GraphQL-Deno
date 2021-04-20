const express = require("express");
const router = express.Router();
const path = require("path");
// All redirect to /admin/...
const adminController = require('../controllers/admin')

router.get("/add-product", adminController.getAddProductsPage);
router.post("/products", adminController.postProductsPage);
router.get('/productsList',(req,res,next)=> {
    res.render('admin/productsList',{
        pageTitle: 'Admin Products',
        path: '/admin/productsList',
        products : []
    })
})

module.exports = { router };
