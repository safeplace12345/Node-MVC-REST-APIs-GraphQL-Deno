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
    const getFullCart = async (userName, cb) => {
        _db = await getDb().collection("users");
        let user = await _db.findOne({ name: userName });
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
                let total = cart.reduce((accum, curr) => {
                    return accum + +curr.proPrice * curr.qty;
                }, 0);

                return cb(cartItems, total);
            });
    };

    const addItem = async (product, userName, cb) => {
        _db = await getDb().collection("users");
        // Find User cart
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
                return cb("Error inserting new item");
            }
        }
        // Update existing Product
        else {
            try {
                item = { ...trimedProduct, qty: userCart.cart[exists].qty + 1 };
                cart[exists] = item;
                _db.updateOne({ name: userName }, { $set: { cart } });
                return cb("Updating existing item");
            } catch (error) {
                return cb("Error Updating existing item");
            }
        }
    };
    const deleteById = async (id, userName, cb) => {
        _db = await getDb().collection("users");
        // Trim Id
        id = id.trim();
        // Find Users cart
        let user = await _db.findOne({ name: userName });
        let { cart } = user;
        // Clean or remove item
        cart = cart.filter((item) => item.proID !== id);
        try {
            _db.updateOne({ name: userName }, { $set: { cart } });
            return cb(`Success deleting from ${userName} cart`);
        } catch (error) {
            return cb(`Error deleting from ${userName} cart`);
        }
    };
    const emptyCart = async (user, cb) => {
        _db = await getDb().collection("users");
        user = await _db.findOne({ _id: new ObjectID('60f06914ea986f80606790a0') });
        let cart = user.cart;
        //Empty cart after placing order
        console.log(cart)
        cart = []
        console.log(cart)
        return await _db
            .updateOne({ _id: new ObjectID('60f06914ea986f80606790a0') }, { $set: {cart} })
            .then((res) => console.log(res))
            .catch((err) => console.log("Error"));
    };
    return {
        addItem,
        getFullCart,
        deleteById,
        emptyCart,
    };
};
module.exports = Cart;
