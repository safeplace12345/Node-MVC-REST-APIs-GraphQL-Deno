const { LocalStorage } = require("node-localstorage");

const Product = require("../models/product");
const User = require("../models/users");

const { validationResult } = require("express-validator/check");

const getAddProductsPage = (req, res, next) => {
    // get cookie-->true
    req.isLoggedin = req.get("Cookie").split("=")[1];
    const oldInput = { title: "", image: "", price: "", description: "" };
    res.render("admin/add-product", {
        pageTitle: "Add-Product",
        path: "/admin/add-product",
        editMode: false,
        oldInput,
        errorMsg : ""
    });
};

const postProductsPage = (req, res, next) => {
    const { _id } = req.user;
    const { title, image, price, description } = req.body;
    // create new product
    const errors = validationResult(req);

    const validationErrParams = errors.array().map((e) => e.params);
    console.log(errors.array())
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/add-product", {
            pageTitle: "Add-Product",
            path: "/admin/add-product",
            editMode: false,
            oldInput : {title,image,price,description},
            validationErrParams,
            errorMsg: errors.array()[0].msg,
        });
    }
    const product = Product({ title, image, price, description, user: _id });
    // save product
    return product
        .save()
        .then((response) => {
            console.log("Successfully saved new product");
            return res.redirect("/clients/");
        })
        .catch((err) => console.log("Error saving product", err));
};
const editProductsPage = (req, res, next) => {
    // get cookie-->true
    req.isLoggedin = req.get("Cookie").split("=")[1];

    const prodID = req.params.prodID;
    const editMode = req.query.edit;


    if (!editMode) {
        return res.redirect("/404");
    }

    const errors = validationResult(req)
    const validationErrParams = errors.array().map((e) => e.params);

    Product.find({ _id: prodID })
        .then((product) => {
            if (!product) {
                return res.redirect("/404");
            }
            return res.render("admin/add-product", {
                pageTitle: "Add-Product",
                path: "/admin/add-product",
                editMode,
                product: product[0],
                errorMsg : "",
                validationErrParams : ""
            });
        })
        .catch((err) => console.log("Product not found", err));
};

const getAllAdminProducts = (req, res, next) => {
    // get cookie-->true
    // req.isLoggedin = (req.get('Cookie').split('=')[1])
    return (
        Product.find({ user: req.user._id })
            // .select("title image price -_id") // Used to select fields . Note :: **-** removes the id field
            // .populate("user", "name email address -_id") // Used to populate reffrenced fields .
            .then((products) => {
                res.render("admin/productsList", {
                    pageTitle: "Admin Products",
                    path: "/admin/productsList",
                    products,
                });
            })
            .catch((err) => console.log("Error finding products", err))
    );
};

const editProductPage = (req, res, next) => {
    let { id, title, image, description, price } = JSON.parse(
        JSON.stringify(req.body)
    );

    const errors = validationResult(req)
    const validationErrParams = errors.array().map((e) => e.params);

    if (!errors.isEmpty()) {
        return res.status(422).render("admin/add-product", {
            pageTitle: "Add-Product",
            path: "/admin/add-product",
            editMode: true,
            oldInput : {title,image,price,description},
            validationErrParams,
            errorMsg: errors.array()[0].msg,
        });
    }

    id = id.trim();
    // Note Objects will contain an _id field after creation
    return Product.findByIdAndUpdate(
        { _id: id, user: req.user._id },
        { title, image, description, price },
        (err, response) => {
            if (err) return console.log("Error updating product", err);

            if (!response) return res.redirect("/clients/");

            console.log("Succesfully updating product", response);
            return res.redirect("/admin/productsList");
        }
    );
};
const deleteProduct = (req, res, next) => {
    let productID = req.body.productID;
    productID = productID.trim();
    return Product.findByIdAndRemove({ _id : productID, user: req.user._id })
        .then((response) => {
            // Delete from cart
            console.log(response)
            if (!response) {
                return res.redirect("/clients/");
            }
            return req.user.removeFromCart(productID, (response) => {
                if (response.includes("Error")) return;
                return res.redirect("/clients/");
            });
        })
        .catch((err) => {
            console.log(err);
            res.redirect("404");
        });
};

module.exports = {
    getAddProductsPage,
    editProductsPage,
    postProductsPage,
    getAllAdminProducts,
    editProductPage,
    deleteProduct,
};
