const { LocalStorage } = require("node-localstorage");

const User = require("../models/users");
const Product = require("../models/product");
const Order = require("../models/orders");
const localStorage = new LocalStorage("./scratch");

const userName = localStorage.getItem("userName");
const renderProductsPage = (req, res, next) => {
  // get cookie-->true
//   req.isLoggedin = (req.get('Cookie').split('=')[1])

    return Product.find()
        .then((products) =>
            res.render("clients/shop", {
                pageTitle: "Shop",
                path: "/clients/",
                products,
                userId: userName.toLowerCase(),
                userName,
                isAuthenticated : req.session.isLoggedin
            })
        )
        .catch((err) => console.log("Error finding products", err));

    };

const renderProdDetailsPage = (req, res, next) => {
     // get cookie-->true
     req.isLoggedin = (req.get('Cookie').split('=')[1])

    const productId = req.params.productId;
    return Product.findById(productId)
        .then((product) => {
            return res.render("clients/productDetails", {
                pageTitle: product._id,
                path: product._id,
                product,
                userName,
                userId: userName.toLowerCase(),
                isAuthenticated : req.session.isLoggedin
            });
        })
        .catch((err) => console.log("Error finding products", err));
};

const renderCartPage = (req, res, next) => {
  // get cookie-->true
//   req.isLoggedin = (req.get('Cookie').split('=')[1])

    let user = req.user;
    user.populate("cart.item._id", "title image price")
        .execPopulate()
        .then((user) => {
            return res.render("clients/cart", {
                pageTitle: "Your Cart",
                path: "/cart",
                products: user.cart,
                total: 100,
                userName,
                isAuthenticated : req.session.isLoggedin
            });
        });
    // Cart().getFullCart(userName, (cart, total) => {
    // });
};

const addToCart = (req, res, next) => {
    // Get current user
    let user = req.user;
    let product = JSON.parse(JSON.stringify(req.body));
    user.addToCart(product, (response) => {
        if (response.includes("Error")) return res.redirect("/404");

        return res.redirect("/clients/cart");
    });
};
const postOrder = (req, res, next) => {
    return req.user
        .populate("cart.item._id -cart._id")
        .execPopulate()
        .then((result) => {
            return result.cart.map((i) => {
                return {
                    _id: i.item._id._id,
                    proPrice: i.item._id.price,
                    qty: i.item.qty,
                    user: req.user._id,
                };
            });
        })
        .then(async (cart) => {
            for (i of cart) {
                // Create an order
                return await new Order({ cart: i }).save(function (err, order) {
                    if (err) return console.log({ err });
                    return console.log("success " + order._id);
                });
            }
        })
        .then((order) => {
            req.user.emptyCart();
            return res.redirect("/clients/cart");
        });
};

const renderHomePage = (req, res, next) => {
  // get cookie-->true
//   req.isLoggedin = (req.get('Cookie').split('=')[1])

    const userName = localStorage.getItem("userName");
    return (
        Product.find()
            // .select("title image price -_id") // Used to select fields . Note :: **-** removes the id field
            // .populate("user", "name email address -_id") // Used to populate reffrenced fields .
            .then((products) => {
                return res.render("clients/index", {
                    pageTitle: "Home",
                    path: "/index",
                    products,
                    userName,
                    isAuthenticated : req.session.isLoggedin
                });
            })
    );
};
const renderOrdersPage = (req, res, next) => {
     // get cookie-->true
//   req.isLoggedin = (req.get('Cookie').split('=')[1])
    Order.find({})
        .populate("cart.user", "address email")
        .select("cart._id cart.qty")
        .then((response) => {
            return res.render("clients/orders", {
                pageTitle: "Orders",
                path: "/orders",
                orders: response,
                userName,
                isAuthenticated : req.session.isLoggedin
            });
        });
};

const removeItem = (req, res, next) => {
    let id = JSON.parse(JSON.stringify(req.body.productId));
    req.user.removeFromCart(id, (response) => {
        return res.redirect("/clients/cart");
    });
};

module.exports = {
    renderProductsPage,
    renderCartPage,
    postOrder,
    renderHomePage,
    renderOrdersPage,
    renderProdDetailsPage,
    addToCart,
    removeItem,
};
