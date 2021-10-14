const { LocalStorage } = require("node-localstorage");
const fs = require("fs");
const pdfDoc = require("pdfkit");

const path = require("../utils/path");
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
            })
        )
        .catch((err) => {
            console.log("Error finding products", err);
            return res.redirect("/404");
        });
};

const renderProdDetailsPage = (req, res, next) => {
    // get cookie-->true
    req.isLoggedin = req.get("Cookie").split("=")[1];

    const productId = req.params.productId;
    return Product.findById(productId)
        .then((product) => {
            return res.render("clients/productDetails", {
                pageTitle: product._id,
                path: product._id,
                product,
                userName,
                userId: userName.toLowerCase(),
                isAuthenticated: req.session.isLoggedin,
            });
        })
        .catch((err) => {
            const error = new Error("Product Details not found", err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

const renderCartPage = (req, res, next) => {
    // get cookie-->true
    //   req.isLoggedin = (req.get('Cookie').split('=')[1])

    let user = req.user;
    user.populate("cart.item._id", "title image price")
        .execPopulate()
        .then((user) => {
            console.log(user);
            return res.render("clients/cart", {
                pageTitle: "Your Cart",
                path: "/cart",
                products: user.cart,
                total: 100,
                userName,
                isAuthenticated: req.session.isLoggedin,
            });
        })
        .catch((err) => {
            const error = new Error("User cart not Found", err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

const addToCart = (req, res, next) => {
    // Get current user
    let user = req.user;
    let product = JSON.parse(JSON.stringify(req.body));
    user.addToCart(product, (response) => {
        if (response.includes("Error")) {
            const error = new Error("User cart missing", response);
            error.httpStatusCode = 500;
            req.flash("error", "User cart missing");
            return next(error);
        }

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
                    isAuthenticated: req.session.isLoggedin,
                });
            })
    );
};
const renderOrdersPage = (req, res, next) => {
    // get cookie-->true
    //   req.isLoggedin = (req.get('Cookie').split('=')[1])
    Order.find({})
        .populate("cart.user")
        .select("cart._id cart.qty")
        .then((response) => {
            return res.render("clients/orders", {
                pageTitle: "Orders",
                path: "/orders",
                orders: response,
                userName,
                isAuthenticated: req.session.isLoggedin,
            });
        });
};

const removeItem = (req, res, next) => {
    let id = JSON.parse(JSON.stringify(req.body.productId));
    req.user.removeFromCart(id, (response) => {
        return res.redirect("/clients/cart");
    });
};

const getInvoice = (req, res, next) => {
    let id = req.params.invoiceId;
    let invoiceName = `invoice-${id}.pdf`;
    let invoicePath = `${path}/data/invoices/${invoiceName}`;
    // let invoicePath = `${path}/data/invoices/empty.pdf`;
    return Order.findOne({ _id: id })
        .then((doc) => {
            if (!doc) {
                res.status(442);
                return next(new Error("Sorry Invoice not found"));
            }
            if (doc.cart.user.toString() !== req.user._id.toString()) {
                res.status(442);
                return next(new Error("Sorry Invoice not found"));
            }
            return doc.cart;
        })
        .then((cart) => {
            /* Retrieve pdf file*/

            // Method 1
            /**
         *   return fs.readFile(invoicePath , (err , data) => {
                if(err) return next(err)
                res.setHeader("Content-Type","application/pdf")
                res.setHeader("Content-Disposition",'attachment; filename=' + invoiceName)
                return res.send(data)
            })

         *
         */

            // Method 2
            /**
             const file = fs.createReadStream(invoicePath);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=" + invoiceName);
            return file.pipe(res);
            */

            // METHOD 3

            const pdfFile = new pdfDoc();
            pdfFile.pipe(fs.createWriteStream(invoicePath)); // create stream
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + invoiceName
            );

            const html = `Your invoice
            > Address : ${cart.proPrice}
            > Email :  ${cart.user}
            > Quantity :${ cart.qty}

            `;

            pdfFile.text(html);
            pdfFile.end();
            return pdfFile.pipe(res);
        })
        .catch((err) => next(err));
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
    getInvoice,
};
