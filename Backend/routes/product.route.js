import { Router } from 'express'
import { auth } from '../middleware/auth.middleware';
import { createProduct, addProduct, updateProduct, deleteProduct, uploadProductImages, getProduct, getProductsCount, getAllProducts } from '../controllers/product.controller.js';
import { uploadSingle, uploadMultiple } from '../config/multer.config.js';



const productRouter = Router();

productRouter.post('/products', auth, createProduct)

productRouter.post('/products/add', auth, addProduct);

productRouter.put('/produts/:id', auth, updateProduct)

productRouter.get('/produts/:id', auth, getProduct);

productRouter.post('/products/:productId/images', auth, uploadMultiple, uploadProductImages,);

productRouter.delete('/products/:id', auth, deleteProduct)

productRouter.get('/products', getProductsCount)

productRouter.get('/products', getAllProducts);



export default productRouter;