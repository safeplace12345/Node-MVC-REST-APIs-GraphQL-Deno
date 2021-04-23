const Cart = require('../models/cart')
const ProductModel = require("../models/product");
const renderProductsPage = (req, res, next) => {
 return ProductModel.fetchAllProducts((productsArr) => {
    res.render("clients/shop", {
      pageTitle: "Shop",
      path: "/",
      products: productsArr,
    });
  });
};

const renderProdDetailsPage = (req,res,next) => {
  const productId = req.params.productId;
  return ProductModel.fetchProduct(productId, (product) => {
   return res.render('clients/productDetails',{
     pageTitle : product.id,
     path: product.id,
     product
   })
  })
}

const renderCartPage = (req, res, next) => {
 return Cart().getFullCart(cart => {
    console.log(cart.length)
    return res.render("clients/cart", {
       pageTitle: "Your Cart",
       path: "/cart",
       products : cart
     });
  })
};

const addToCart = (req, res, next) => {
  const proId = (req.body.proID);
  const arg = { id: +proId, qty: 1 };
  Cart().addItem(arg)
  res.redirect("/cart");
};
const renderCheckoutPage = (req, res, next) => {
 return res.render("clients/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

const renderHomePage = (req, res, next) => {
  return ProductModel.fetchAllProducts((productsArr) => {
    res.render("clients/index", {
      pageTitle: "Home",
      path: "/index",
      products: productsArr,
    });
  });
};
const renderOrdersPage = (req, res, next) => {
 return res.render("clients/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

module.exports = {
  renderProductsPage,
  renderCartPage,
  renderCheckoutPage,
  renderHomePage,
  renderOrdersPage,
  renderProdDetailsPage,
  addToCart
};
