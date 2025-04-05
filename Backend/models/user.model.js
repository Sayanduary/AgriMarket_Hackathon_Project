import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "provide name"]
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "provide password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: null
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'address'
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cartProduct'
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'order'
        }
    ],
    otp: {
        code: String,
        expiresAt: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }


    ,
    role: {
        type: String,
        enum: ['ADMIN', "USER"],
        default: "USER"
    }
},
    {
        timestamps: true
    });


    


const userModel = mongoose.model("user", userSchema);

export default userModel;
