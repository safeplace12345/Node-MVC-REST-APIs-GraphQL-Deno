const ProductModel = require("./product");
const fs = require("fs");
const pathMaker = require("../utils/pathMaker");
const deleteById = require('../utils/deleteById')
const fileReader = require('../utils/readFiles')
const initialCart = { products: [], totalPrice: 0 };
const file = pathMaker("cart.json");



const Cart = () => {
  const readFile = (cb) => {
    return fileReader.cart(initialCart,file,cb)
  };

  const getFullCart = (cb) => {
    return readFile((cart) => {
      let cartItems = cart.products.map((item) => item.id.toString());
      let addedItems = [];
      let total = cart.totalPrice
      ProductModel.fetchAllProducts((products) => {
        addedItems = products.filter((prod) => cartItems.indexOf(prod.id) > -1);
        return cb(addedItems,total);
      });
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
        cart.totalPrice += product.price;
        console.log(cart);
      } else {
        let updatedItem = { ...existingItem };
        updatedItem.qty += 1;
        console.log(updatedItem);
        cart.products = [...cart.products];
        cart.products[existingItemIndex] = updatedItem;
        cart.totalPrice += product.price;
      }
      writeFile(cart);
    });
  };
  const deleteItem = id => {
    return deleteById(id,readFile,writeFile)
  }
  return {
    addItem,
    getFullCart,
    deleteItem
  };
};
module.exports = Cart;
