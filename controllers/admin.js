const ProductModel = require("../models/product");
const getAddProductsPage = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
  });
};

const postProductsPage = (req, res, next) => {
  const Product = ProductModel.Product;
  const product = new Product(JSON.parse(JSON.stringify(req.body)));
  product.save();
  res.redirect("/");
};
const editProductsPage = (req, res, next) => {
  const prodID = req.params.prodID;
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/404')
  }
  ProductModel.fetchProduct(prodID,product => {
   console.log(product)
   res.render("admin/add-product", {
     pageTitle: "Add-Product",
     path: "/admin/add-product",
     editMode,
     product
   });
 })
};

const getAllAdminProducts = (req, res, next) => {
  return ProductModel.fetchAllProducts((productsArr) => {
    return res.render("admin/productsList", {
      pageTitle: "Admin Products",
      path: "/admin/productsList",
      products: productsArr,
    });
  });
};
module.exports = {
  getAddProductsPage,
  editProductsPage,
  postProductsPage,
  getAllAdminProducts,
};
