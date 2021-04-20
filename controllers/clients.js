const ProductModel = require("../models/product");
const renderProductsPage = (req, res, next) => {
  ProductModel.readProductsFile((productsArr) => {
    res.render("clients/shop", {
      pageTitle: "Shop",
      path: "/",
      products: productsArr,
    });
  });
};

const renderCartPage = (req, res, next) => {
  res.render("clients/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
  });
};

const renderCheckoutPage = (req, res, next) => {
  res.render("clients/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

const renderHomePage = (req, res, next) => {
  res.render("clients/index", {
    pageTitle: "Home",
    path: "/index",
    products: [],
  });
};
module.exports = {
    renderProductsPage,
    renderCartPage,
    renderCheckoutPage,
    renderHomePage
}
