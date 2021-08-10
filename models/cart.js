const fs = require("fs");

const ObjectID = require("mongodb").ObjectID;
const pathMaker = require("../utils/pathMaker");
const deleteById = require("../utils/deleteById");
const fileReader = require("../utils/readFiles");
const initialCart = { products: [], totalPrice: 0 };

const { getDb } = require("../utils/database");

const file = pathMaker("cart.json");
// Database conn
let _db;
const Cart = () => {
    const readFile = (cb) => {
        return fileReader.cart(initialCart, file, cb);
    };

    const getFullCart = async (userName, cb) => {
        _db = await getDb().collection("users");
        const user = await _db.findOne({ name: userName });
        // Get cart
        const { cart } = await user;
        // Modify cart for Ui reasons

        await getDb()
            .collection("shop")
            .find({})
            .toArray((err, res) => {
                if (err) console.log(err);
                // Map product id's from cart
                const productIDs = cart.map((item) => item.proID);
                // Filter products
                const cartItems = res.filter(({ _id }) =>
                    productIDs.includes(_id.toString())
                );
                // Calculate total price for all items
                let total = cartItems.reduce((acc, curr) => {
                    return acc + curr.price;
                }, 0);

                return cb(cartItems,total);
            });
    };
    const writeFile = (data) => {
        return fs.writeFile(file, JSON.stringify(data), (err) => {
            console.log(err);
        });
    };
    const addItem = async (product, userName, cb) => {
        _db = await getDb().collection("users");
        let userCart = await _db.findOne({ name: userName });
        // update cart now
        let cart = await userCart.cart;

        // Check for existing product
        const exists = cart.findIndex((item) => {
            return item.proID.toString() == product.proID.toString();
        });

        // trim product Object
        const trimedProduct = JSON.parse(JSON.stringify(product));
        let item;
        // Add new Product
        if (exists === -1) {
            try {
                item = { ...trimedProduct, qty: 1 };
                cart = [...cart, item];
                _db.updateOne({ name: userName }, { $set: { cart } });
                return cb("Inserting new item");
            } catch (e) {
                console.log(e);
                cb("Error inserting new item");
            }
        }
        // Update existing Product
        else {
            try {
                item = { ...trimedProduct, qty: userCart.cart[exists].qty + 1 };
                cart = [...cart, item];
                _db.updateOne({ name: userName }, { $set: { cart } });
                return cb("Updating existing item");
            } catch (error) {
                return cb("Error Updating existing item");
            }
        }
    };
    const deleteItem = (id) => {
        console.log(id)
    };
    return {
        addItem,
        getFullCart,
        deleteItem,
    };
};
module.exports = Cart;
