const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: Number,
    id: String,
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

// Initiate the database

module.exports = mongoose.model("Product", ProductSchema);
