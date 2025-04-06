import { Router } from 'express'

import { uploadCategoryImages, createCategory, getCategories, getCategoriesCount, getSubcategoryCount, getSingleCategory, deleteCategory, deleteCategoryImages } from '../controllers/category.controller.js'

import { uploadSingle, uploadMultiple } from '../config/multer.config.js';

import { auth } from '../middleware/auth.middleware.js';




const categoryRouter = Router();

categoryRouter.post('/create', auth, createCategory)
categoryRouter.post('/uploadImages/:categoryId', auth, uploadMultiple, uploadCategoryImages);
categoryRouter.get('/', getCategories)
categoryRouter.get('/count', auth, getCategoriesCount)
categoryRouter.get('/subcategory-count/:parentId', auth, getSubcategoryCount);
categoryRouter.get('/:id', auth, getSingleCategory);
categoryRouter.delete('/deleteCategory/:id', deleteCategory)
categoryRouter.delete('/categories/:categoryId/images', auth, deleteCategoryImages)


//some more code need to be added  in vide 33 (1:35:56)

export { categoryRouter };