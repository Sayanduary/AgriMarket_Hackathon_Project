import { Router } from "express";
import { addToCartItemController ,getCartItemController, updateCartItemQtyController ,deleteCartItemQtyController} from "../controllers/cart.controller";
import auth from "../middleware/auth.js";

const cartRouter = Router();

cartRouter.post('/add',auth,addToCartItemController)
cartRouter.get('/get',auth, getCartItemController)
cartRouter.put('/update-qty',auth, updateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth,deleteCartItemQtyController) 


export default cartRouter