const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId:{type:String, required:true},
        product:[
            {
                productId:{type:String},
                quantity:{type:Number,defoault:1},

            },
        ],
    },
    {timestamps:true}

);

module.exports = mongoose.model("Cart",CartSchema);