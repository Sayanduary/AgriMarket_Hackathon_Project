import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type : String,
        required : [true,"provide name"]
    },
    email: {
        type : String,
        required : [true,"provide email"],
        unique: true
    },
    password: {
        type : String,
        required : [true,"provide password"]
    },
    avatar: {
        type : String,
        default : ""
    },
    mobile: {
        type : Number,
        default : null
    },
    verify_email: {
        type : boolean,
        default : false
    },
    last_login_date: {
        type : Date,
        default : ""
    },
    status : {
        type : string,
        enum : ["Active","Inactive","Suspended"],
        default : "Active"
    },
    address_details : [
        {
        type : mongoose.Schema.ObjectID,
        ref : 'address'
        }
    ],
    shopping_cart : [
        {
        type : mongoose.Schema.ObjectID,
        ref : 'cartProduct'
        }
    ],
    orderHistory : [
        {
        type : mongoose.Schema.ObjectID,
        ref : 'order'
        }
    ],
    forgot_password_otp : {
        type : String,
        default : null
    },
    forgot_password_expiry : {
        type : Date,
        default : null
    },
    role : {
        type : String,
        enum : ['ADMIN',"USER"],
        default : "USER"
    }
},
{
    timestamps : true
})
const userModel = mongoose.model("user", userSchema);

export default userModel
