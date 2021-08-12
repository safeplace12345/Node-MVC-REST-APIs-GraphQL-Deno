const { LocalStorage } = require("node-localstorage");

const ProductModel = require("../models/product").Product;
const Cart = require("../models/cart")
const localStorage = new LocalStorage("./scratch");

const userName = localStorage.getItem("userName");

const getAddProductsPage = (req, res, next) => {
    res.render("admin/add-product", {
        pageTitle: "Add-Product",
        path: "/admin/add-product",
        editMode: false,
        userName,
    });
};

const postProductsPage = (req, res, next) => {
    const product = new ProductModel(req.body);
   return product.saveOrUpdate(response => {
      if(response.includes('Error')) return res.redirect('404')

     return res.redirect("/clients/");
    });
};
const editProductsPage = (req, res, next) => {
    const prodID = req.params.prodID;
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect("/404");
    }

    ProductModel.fetchSingleProduct(prodID, (product) => {
        if (!product) {
            return res.redirect("/404");
        }
        return res.render("admin/add-product", {
            pageTitle: "Add-Product",
            path: "/admin/add-product",
            editMode,
            product,
            userName,
        });
    });
};

const getAllAdminProducts = (req, res, next) => {
    let pM = ProductModel;
    return pM.fetchAllProducts((products) => {
        return res.render("admin/productsList", {
            pageTitle: "Admin Products",
            path: "/admin/productsList",
            products,
            userName,
        });
    });
};

const editProductPage = (req, res, next) => {
    let pM = ProductModel;
    // Note Objects will contain an _id field after creation
    const updatedProduct = new ProductModel(
        JSON.parse(JSON.stringify(req.body))
    );
    return updatedProduct.saveOrUpdate((response) => {
        if (response.includes("Error")) return res.redirect("/404");

        return res.redirect("admin/productsList");
    });
};
const deleteProduct = (req, res, next) => {
    const id = req.body.productID;
    return ProductModel.deleteById(id, (response) => {
        if(response.includes('Error')) return res.redirect('404')
            return Cart().deleteById(id,userName,(response) => {
                console.log(response)
                if(response.includes("Error"))return res.redirect('404')
               return res.redirect("/clients/");
            })
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
