import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productId : {
        type : mongoose.schema.ObjectId,
        ref : 'Product'
    },
    quantity : {
        type : Number,
        default : 1
    },
    userId : {
        type : mongoose.schema.ObjectId,
        ref : "User"
    }
},{
    timestamps : true
})
const CartProductModel = mongoose.model('cartProduct', cartProductSchema);

export default CartProductModel