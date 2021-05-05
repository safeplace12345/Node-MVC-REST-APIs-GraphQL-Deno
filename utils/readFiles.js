const fs = require('fs')
const readFile = {
  products : (cb,file) => {
        return fs.readFile(file, "utf-8", (err, content) => {
    if (!err) {
      return cb(JSON.parse(content));
    }
    return cb([]);
  });
    },
    cart :  (initCart,file,cb) => {
       return fs.readFile(file, "utf-8", (err, content) => {
         let cart = initCart;
         if (!err) {
           cart = JSON.parse(content);
           return cb(cart);
         } else {
           return cb(initCart);
         }
       });
   }
};

module.exports = readFile