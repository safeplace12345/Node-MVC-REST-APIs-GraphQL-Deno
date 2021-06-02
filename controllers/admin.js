const ProductModel = require("../models/product");
const getAddProductsPage = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
    editMode : false
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
    if(!product){
      return res.redirect('/404')
    }
    res.render("admin/add-product", {
      pageTitle: "Add-Product",
      path: "/admin/add-product",
      editMode,
      product
    });
  })
};

const getAllAdminProducts = (req, res, next) => {
  return ProductModel.fetchAllProducts()
    .then((response) => {
      return res.render("admin/productsList", {
        pageTitle: "Admin Products",
        path: "/admin/productsList",
        products: response[0]
      });
    })
    .catch((err) => {
      console.log(err)
      return res.render("admin/productsList", {
        pageTitle: "Admin Products",
        path: "/admin/productsList",
        products: []
      });
    });

  }

const editProductPage = (req,res,next)=>{
  const Product = ProductModel.Product;
  const updatedProduct = new Product(JSON.parse(JSON.stringify(req.body)));
  const id = JSON.parse(JSON.stringify(req.body.id));
  updatedProduct.edit(id);
  res.redirect('/404');
}
const deleteProduct = (req,res,next)=>{
  const id = req.body.productID;
  ProductModel.deleteProductFromFile(id,(products => {
    res.redirect("/");
  }))

}

module.exports = {
  getAddProductsPage,
  editProductsPage,
  postProductsPage,
  getAllAdminProducts,
  editProductPage,
  deleteProduct
};
