const ProductModel = require("./product");
const fs = require("fs");
const path = require("path");
const initialCart = { products: [], totalPrice: 0 };
const file = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

const Cart = () => {
  const readFile = (cb) => {
    return fs.readFile(file, "utf-8", (err, content) => {
      let cart = initialCart;
      if (!err) {
        cart = JSON.parse(content);
        return cb(cart);
      } else {
        return cb(initialCart);
      }
    });
  };

  const getFullCart = (cb) => {
    return readFile((cart) => {
      let cartItems = cart.products;
      ProductModel.fetchAllProducts((products) => {
        const cart_items = products.filter(product => product.id <= cartItems.length ) 
        console.log(items)
      }
      );
    });
  };
  const writeFile = (data) => {
    return fs.writeFile(file, JSON.stringify(data), (err) => {
      console.log(err);
    });
  };
  const addItem = (product) => {
    return readFile((cart) => {
      const products = cart.products;
      const existingItemIndex = products.findIndex(
        (item) => item.id === product.id
      );
      const existingItem = products[existingItemIndex];
      if (existingItemIndex < 0) {
        cart.products.push(product);
        cart.totalPrice += 1;
        console.log(cart);
      } else {
        let updatedItem = { ...existingItem };
        updatedItem.qty += 1;
        console.log(updatedItem);
        cart.products = [...cart.products];
        cart.products[existingItemIndex] = updatedItem;
        cart.totalPrice += 1;
      }
      writeFile(cart);
    });
  };
  return {
    addItem,
    getFullCart,
  };
};
module.exports = Cart;
