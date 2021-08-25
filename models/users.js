const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    cart: {
        type: [
            {
                item: {
                    _id: {
                        type: Schema.Types.ObjectId,
                        required: true,
                        ref: "Product",
                    },
                    qty: { type: Number, required: true },
                },
            },
        ],
        required: true,
    },
});

userSchema.methods.addToCart = function (product, cb) {
    // trim product Object
    const trimedProduct = JSON.parse(JSON.stringify(product));

    const item = {
        _id: trimedProduct.proID, // _id must be specified otherwise mongodb goes nuts
        qty: 1,
    };
    const exists = this.cart.findIndex((i
        ) => {
      return  i.item._id == item._id});

    let updatedCart = this.cart;
    if (exists > -1) {
        //Update cart
        let existingItem = updatedCart[exists];
        existingItem.qty += 1;

        updatedCart[exists] = existingItem;
    } else {
        //Add new item
        updatedCart.push({ item });
    }

    this.cart = updatedCart;
    this.save(function (err) {
        if (err) return console.log({ err });
        cb("Success");
    });
};

userSchema.methods.emptyCart = function () {
    this.cart = [];
    return this.save();
};

userSchema.methods.removeFromCart = function (productId, cb) {
    productId = productId.trim();
    // Get Users cart
    let { cart } = this;
    // Clean or remove item

    const updated = cart.filter(({ item }) => {
        console.log(item._id,productId)
       return item._id === productId;
    });
    this.cart = updated;
    console.log(this.cart)
    return this.save(function(err){
        if(err) return console.log({err})
        return cb(`Success deleting from ${productId} cart`);
    })

};

module.exports = mongoose.model("User", userSchema);