const { LocalStorage } = require("node-localstorage");

const Product = require("../models/product");
const User = require("../models/users");
const localStorage = new LocalStorage("./scratch");

const userName = localStorage.getItem("userName");

const getAddProductsPage = (req, res, next) => {
  // get cookie-->true
  req.isLoggedin = (req.get('Cookie').split('=')[1])

    res.render("admin/add-product", {
        pageTitle: "Add-Product",
        path: "/admin/add-product",
        editMode: false,
    });
};

const postProductsPage = (req, res, next) => {
    const { _id } = req.user;
    const { title, image, price, description } = req.body;
    // create new product
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
    req.isLoggedin = (req.get('Cookie').split('=')[1])

    const prodID = req.params.prodID;
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect("/404");
    }
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
                userName,


            });
        })
        .catch((err) => console.log("Product not found", err));
};

const getAllAdminProducts = (req, res, next) => {
  // get cookie-->true
    req.isLoggedin = (req.get('Cookie').split('=')[1])


    return Product.find()
        // .select("title image price -_id") // Used to select fields . Note :: **-** removes the id field
        // .populate("user", "name email address -_id") // Used to populate reffrenced fields .
        .then((products) => {
            res.render("admin/productsList", {
                pageTitle: "Admin Products",
                path: "/admin/productsList",
                products,
                userName,
            });
        })
        .catch((err) => console.log("Error finding products", err));
};

const editProductPage = (req, res, next) => {
    let { id, title, image, description, price } = JSON.parse(
        JSON.stringify(req.body)
    );

    id = id.trim();
    // Note Objects will contain an _id field after creation
    return Product.findByIdAndUpdate(
        { _id: id },
        { title, image, description, price },
        (err, response) => {
            if (err) return console.log("Error updating product", err);
            console.log("Succesfully updating product");
            return res.redirect("/admin/productsList");
        }
    );
};
const deleteProduct = (req, res, next) => {
    let productID = req.body.productID;
    productID = productID.trim();
    return Product.findByIdAndRemove(productID)
        .then((response) => {
            // Delete from cart
            return req.user.removeFromCart(productID ,(response) => {
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
