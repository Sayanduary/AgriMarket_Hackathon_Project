import CartProductModel from "../models/cartproduct.model.js";
import userModel from "../models/user.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async(request,response) =>{
    try {
        const userId = request.userId
        const { productId } =request.body

        if(!productId){
            return response.status(402).json({
                message : "provide productId",
                error : true,
                success : false
            })
        }


        const checkItemCart =await CartProductModel.findOne({
            userId : userId,
            productId : productId
        })

        if(checkItemCart){
            return response.status(400).json({
                message : "item already in cart"
            })        
        }

        const cartItem =new CartProductModel({
            quantity : 1,
            userId : userId,
            productId : productId
        })


        const save = await cartItem.save()

        const updateCartUser = await userModel.updateOne({
            _id : userId
        },{
            $push : {
                shopping_cart : productId
            }
        })

        return response.status(200).json({
            data : save,
            message : "Item add successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getCartItemController = async(request,response)=>{
    try {
        const userId =request.userId;

        const cartItem = await CartProductModel.find({
            userId : userId
        }).populate('productId')

        return response.json({
            data : cartItem,
            error : false,
            success : true
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateCartItemQtyController = async(request,response)=>{
    try {
        const userId =request.userId
        const { _id,qty } =request.body


        if(!_id || !qty){
            return response.status(400).json({
                message : "provide _id ,qty"
            })

        }

        const updateCartitem =await CartProductModel.updateOne(
        {
            _id : _id,
            userId : userId
        },
        {
            quantity : qty
        })
         
        return response.json({
            message : "update cart",
            success : true,
            error : false,
            data : updateCartitem
        })


  } catch (error) {
    return response.status(500).json({
        message : error.message || error,
        error : true,
        success : false
    })
    
  }
}

export const deleteCartItemQtyController = async(request,response)=>{
    try {
        const userId = request.userId //middleware
        const {_id, productId }  = request.body

        if (!_id){
            return response.stauts(400).json({
                message : "provide_id",
                error : true,
                success : false
            })
        }


        const deleteCartItem = await CartProductModel.deleteOne({
            _id : _id,
            userId : userId
        })

        if(!deleteCartItem){
            return response.status(400).json({
                message : "The product in the cart is not found",
                error : true,
                success : false
            })
        }

         const user = await userModel.findOne({
            _id : userId
         })

         const cartItems =user?.shopping_cart;

         const updatedUserCart =[...cartItems.slice(0, cartItems.indexof(productId)),...
            cartItems.slice(cartItems.indexOf(productId) + 1)
         ];

         user.shopping_cart = updatedUserCart;
         await user.save();

        return response.json({
            message : "item remove",
            error : false,
            success : true,
            data : deleteCartItem

        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}