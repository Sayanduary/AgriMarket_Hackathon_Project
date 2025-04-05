import mongoose from "mongoose";

const myListSchema = new mongoose.schema({
    productId:{
        type : String,
        required : true
    },
    userId: {
        type : String,
        required : true
    },
    productTitle:{
        type : String,
        required : true
    },
    image: {
        type : String,
        required : true
    },
    rating:{
        type : number,
        required : true
    },
    price: {
        type : number,
        required : true
    },
    oldPrice: {
        type : number,
        required : true
    },
    brand: {
        type : String,
        required : true
    },
    discount: {
        type : number,
        required : true
    },
},{
    timestamps : true
})

const myListModel = mongoose.model('MyList', myListSchema);

export default myListModel