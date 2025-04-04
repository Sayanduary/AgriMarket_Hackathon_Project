import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userID : {
        type : mongoose.schema.ObjectId,
        ref : 'user'
    },
    oderId : {
        type : String,
        required : [true, "provide orderId"],
        unique : true
    },
    productId : {
        type : mongoose.schema.ObjectId,
        ref : "product"
    },
    product_details : {
        name : String,
        image : Array,
    },
    paymentId : {
        type : String,
        default : ""
    },
    payment_status : {
        type : String,
        default : ""
    },
    delivary_address : {
         type : mongoose.schema.ObjectId,
        ref : 'address'
    },
    subTotalAmt : {
        type : Number,
        default : 0
    },
    totalAmt : {
        type : Number,
        default : 0
    },

},{
    timestamps : true
})
const OrderModel = mongoose.model('order', orderSchema);

export default OrderModel