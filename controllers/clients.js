const Cart = require('../models/cart')
const ProductModel = require("../models/product");
const renderProductsPage = (req, res, next) => {
 return ProductModel.fetchAllProducts((products) => {
   return res.render("clients/shop", {
     pageTitle: "Shop",
     path: "/",
     products,
   });
 });

  //  return ProductModel.fetchAllProducts()
//    .then((response) => {
//      return res.render("clients/shop", {
//        pageTitle: "SHOP",
//        path: "/",
//        products: response[0],
//      });
//    })
//    .catch((err) => {
//      return res.render("clients/shop", {
//        pageTitle: "SHOP",
//        path: "/",
//        products: [],
//      });
//    });
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
 return Cart().getFullCart((cart,total) => {
    return res.render("clients/cart", {
       pageTitle: "Your Cart",
       path: "/cart",
       products : cart,
       total : +total.toFixed(2)
     });
  })
};

const addToCart = (req, res, next) => {
  const proId = (req.body.proID);
  const proPrice = req.body.proPrice;
  const arg = { id: +proId, qty: 1  ,price : +proPrice };
  let cart = Cart()
  cart.addItem(arg)
  cart.getFullCart((cart,total) => {
    res.redirect("/cart");
  } )
};
const renderCheckoutPage = (req, res, next) => {
 return res.render("clients/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

const renderHomePage = (req, res, next) => {
  return ProductModel.fetchAllProducts(products => {
    return res.render("clients/index", {
       pageTitle: "Home",
       path: "/index",
       products
     });

  })
  // .then(
  //   response => {
  //   }
  //   ).catch(
  //     err => {
  //  return res.render("clients/index", {
  //     pageTitle: "Home",
  //     path: "/index",
  //     products: [0],
  //   });

  // }
  // );
};
const renderOrdersPage = (req, res, next) => {
 return res.render("clients/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};
const removeItem = (req, res, next) => {
  let item = req.body.productId
  Cart().deleteItem(item)
 return res.redirect('/cart');
};

module.exports = {
  renderProductsPage,
  renderCartPage,
  renderCheckoutPage,
  renderHomePage,
  renderOrdersPage,
  renderProdDetailsPage,
  addToCart,
  removeItem
};
