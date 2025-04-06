import { updateProduct } from "../controllers/product.controller";

//code need to be written
productRouter.delete('/:id',deleteProduct);
productRouter.get('/:id',getProduct);
productRouter.delete('/deleteImage',AuthenticatorAssertionResponse, removeImageFromCloudinary);
productRouter.put('/updateProduct/:id',AuthenticatorAssertionResponse, updateProduct);
export default productRouter;