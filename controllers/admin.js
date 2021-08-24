const { LocalStorage } = require("node-localstorage");

const Product = require("../models/product");
const Cart = require("../models/cart");
const localStorage = new LocalStorage("./scratch");

const userName = localStorage.getItem("userName");

const getAddProductsPage = (req, res, next) => {
  // get cookie-->true
  req.isLoggedin = (req.get('Cookie').split('=')[1])

    res.render("admin/add-product", {
        pageTitle: "Add-Product",
        path: "/admin/add-product",
        editMode: false,
        userName,
        isAuthenticated : req.isLoggedin
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
                isAuthenticated : req.isLoggedin

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
            console.log(products);
            res.render("admin/productsList", {
                pageTitle: "Admin Products",
                path: "/admin/productsList",
                products,
                userName,
                isAuthenticated : req.isLoggedin

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
    let id = req.body.productID;
    id = id.trim();
    return Product.findByIdAndRemove(id)
        .then((response) => {
            return res.redirect("/clients/");
            // Delete from cart
            return Cart().deleteById(id, userName, (response) => {
                console.log(response);
                if (response.includes("Error")) return;
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
