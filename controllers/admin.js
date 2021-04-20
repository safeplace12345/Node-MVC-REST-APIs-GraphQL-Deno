const ProductModel = require('../models/product')
const getAddProductsPage = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
  });
};

const postProductsPage = (req, res, next) => {
  const Product = ProductModel.Product
  const product = new Product(JSON.parse(JSON.stringify(req.body.title)));
  product.save();
  res.redirect("/");
};

module.exports={
getAddProductsPage,
postProductsPage,
}