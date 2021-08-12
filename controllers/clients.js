const { LocalStorage } = require("node-localstorage");

const Cart = require("../models/cart");
const ProductModel = require("../models/product").Product;
const Orders = require("../models/orders");
const localStorage = new LocalStorage("./scratch");

const userName = localStorage.getItem("userName");
const renderProductsPage = (req, res, next) => {
    return ProductModel.fetchAllProducts((products) => {
        return res.render("clients/shop", {
            pageTitle: "Shop",
            path: "/clients/",
            products,
            userId: userName.toLowerCase(),
            userName,
        });
    });
};

const renderProdDetailsPage = (req, res, next) => {
    const productId = req.params.productId;
    return ProductModel.fetchSingleProduct(productId, (product) => {
        return res.render("clients/productDetails", {
            pageTitle: product.id,
            path: product.id,
            product,
            userName,
            userId: userName.toLowerCase(),
        });
    });
};

const renderCartPage = (req, res, next) => {
    Cart().getFullCart(userName, (cart, total) => {
        return res.render("clients/cart", {
            pageTitle: "Your Cart",
            path: "/cart",
            products: cart,
            total: total.toFixed(2),
            userName,
        });
    });
};

const addToCart = (req, res, next) => {
    Cart().addItem(req.body, userName, (response) => {
        if (response.includes("Error")) return res.redirect("/404");

        return res.redirect("/clients/cart");
    });
};
const renderCheckoutPage = (req, res, next) => {
    const userName = req.query.user;

    return Cart().getFullCart(userName, (cart, total) => {
        // Create an order
        const order = new Orders(cart, userName);
        // Save the order
        return order.addOrder((response) => {
            if (response.includes("Error")) return res.redirect("404");
            //  Empty users cart
            Cart().emptyCart(userName, (response) => {
                if (response.includes("Error")) return res.redirect("404");
                // redirect
                return res.redirect('/clients/cart');
            });
        });
    });
};

const renderHomePage = (req, res, next) => {
    const userName = localStorage.getItem("userName");
    return ProductModel.fetchAllProducts((products) => {
        return res.render("clients/index", {
            pageTitle: "Home",
            path: "/index",
            products,
            userId: req.body.user._id,
            userName,
        });
    });
};
const renderOrdersPage = (req, res, next) => {
    return res.render("clients/orders", {
        pageTitle: "Orders",
        path: "/orders",
    });
};
const removeItem = (req, res, next) => {
    let id = req.body.productId;
    Cart().deleteItem(id);
    // return res.redirect("/cart");
};

module.exports = {
    renderProductsPage,
    renderCartPage,
    renderCheckoutPage,
    renderHomePage,
    renderOrdersPage,
    renderProdDetailsPage,
    addToCart,
    removeItem,
};
