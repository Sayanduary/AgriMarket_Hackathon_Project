// import dotenv from 'dotenv';
// dotenv.config();
// import productModel from "../models/product.model.js";




// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs'

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
//     secure: true,
// });





// import productModel from '../models/productModel.js';

// // createProduct - Basic product creation with minimal validation
// export async function createProduct(req, res) {
//     try {
//         const {
//             name,
//             description,
//             images,
//             category,
//             countInStock,
//             discount
//         } = req.body;

//         // Minimal required fields validation
//         if (!name || !description || !images || !category || !countInStock || !discount) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Basic required fields are missing'
//             });
//         }

//         const newProduct = new productModel({
//             name: name.trim(),
//             description: description.trim(),
//             images,
//             category,
//             countInStock: Number(countInStock),
//             discount: Number(discount),
//             dateCreated: Date.now()
//         });

//         const savedProduct = await newProduct.save();

//         return res.status(201).json({
//             success: true,
//             message: 'Product created successfully with basic details',
//             data: savedProduct
//         });

//     } catch (error) {
//         console.error('Error in createProduct:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to create product',
//             error: error.message
//         });
//     }
// }

// // addProduct - Enhanced product creation with all fields and additional validation
// export async function addProduct(req, res) {
//     try {
//         const {
//             name,
//             description,
//             images,
//             brand,
//             price,
//             oldPrice,
//             catName,
//             catId,
//             subCatId,
//             subCat,
//             thirdsubCat,
//             thirdsubCatId,
//             category,
//             countInStock,
//             rating,
//             isFeatured,
//             discount,
//             productRam,
//             size,
//             productHeight,
//             productWeight
//         } = req.body;

//         // Comprehensive required fields validation
//         if (!name || !description || !images || !category || !countInStock || !discount) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Missing required fields for detailed product creation'
//             });
//         }

//         // Check for duplicate product
//         const existingProduct = await productModel.findOne({
//             name: name.trim(),
//             category
//         });

//         if (existingProduct) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'Product with this name already exists in this category'
//             });
//         }

//         const newProduct = new productModel({
//             name: name.trim(),
//             description: description.trim(),
//             images,
//             brand: brand || '',
//             price: Number(price) || 0,
//             oldPrice: Number(oldPrice) || 0,
//             catName: catName || '',
//             catId: catId || '',
//             subCatId: subCatId || '',
//             subCat: subCat || '',
//             thirdsubCat: thirdsubCat || '',
//             thirdsubCatId: thirdsubCatId || '',
//             category,
//             countInStock: Number(countInStock),
//             rating: Number(rating) || 0,
//             isFeatured: Boolean(isFeatured) || false,
//             discount: Number(discount),
//             productRam: productRam || [],
//             size: size || [],
//             productHeight: productHeight || [],
//             productWeight: productWeight || [],
//             dateCreated: Date.now()
//         });

//         const savedProduct = await newProduct.save();

//         // Populate category for the response
//         const populatedProduct = await productModel
//             .findById(savedProduct._id)
//             .populate('category');

//         return res.status(201).json({
//             success: true,
//             message: 'Product added successfully with full details',
//             data: populatedProduct
//         });

//     } catch (error) {
//         console.error('Error in addProduct:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to add product',
//             error: error.message
//         });
//     }
// }

// export async function updateProduct(req, res) {
//     try {
//         const { id } = req.params;
//         const updateData = req.body;

//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Product ID is required'
//             });
//         }

//         // Remove undefined fields and dateCreated from update data
//         const filteredUpdateData = Object.fromEntries(
//             Object.entries(updateData).filter(([_, value]) => value !== undefined)
//         );
//         delete filteredUpdateData.dateCreated;

//         const updatedProduct = await productModel
//             .findByIdAndUpdate(
//                 id,
//                 {
//                     ...filteredUpdateData,
//                     ...(updateData.name && { name: updateData.name.trim() }),
//                     ...(updateData.description && { description: updateData.description.trim() })
//                 },
//                 {
//                     new: true,
//                     runValidators: true
//                 }
//             )
//             .populate('category');

//         if (!updatedProduct) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found'
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: 'Product updated successfully',
//             data: updatedProduct
//         });

//     } catch (error) {
//         console.error('Error updating product:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to update product',
//             error: error.message
//         });
//     }
// }


// // Upload images for a product
// export async function uploadProductImages(req, res) {
//     try {
//         // Check if files are present
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No files uploaded"
//             });
//         }

//         // Get product ID from params
//         const productId = req.params.productId;
//         if (!productId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Product ID is required"
//             });
//         }

//         // Verify the product exists
//         const product = await productModel.findById(productId);
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         // Prepare to upload images to Cloudinary
//         const uploadedImages = [];

//         for (const file of req.files) {
//             const filePath = file.path;
//             try {
//                 // Upload each file to Cloudinary
//                 const result = await cloudinary.uploader.upload(filePath, {
//                     use_filename: true,
//                     unique_filename: false,
//                     overwrite: false,
//                     folder: `products/${productId}` // Organize images by product
//                 });

//                 uploadedImages.push(result.secure_url);
//             } catch (uploadError) {
//                 console.error(`Error uploading file: ${filePath}`, uploadError);
//                 // Continue with other files even if one fails
//             } finally {
//                 // Clean up local file
//                 if (fs.existsSync(filePath)) {
//                     fs.unlinkSync(filePath);
//                 }
//             }
//         }

//         // If no images were successfully uploaded
//         if (uploadedImages.length === 0) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to upload any images"
//             });
//         }

//         // Update the product with new images
//         const updatedProduct = await productModel.findByIdAndUpdate(
//             productId,
//             { $push: { images: { $each: uploadedImages } } },
//             { new: true }
//         ).populate('category');

//         return res.status(200).json({
//             success: true,
//             message: "Product images uploaded successfully",
//             product: updatedProduct,
//             uploadedImages: uploadedImages
//         });

//     } catch (error) {
//         console.error('Error in uploadProductImages:', error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Product image upload failed"
//         });
//     }
// }


// export async function getProduct(req, res) {
//     try {
//         const { id } = req.params;

//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Product ID is required'
//             });
//         }

//         const product = await productModel
//             .findById(id)
//             .populate('category');

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found'
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: product
//         });

//     } catch (error) {
//         console.error('Error fetching product:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to fetch product',
//             error: error.message
//         });
//     }
// }

// export async function deleteProduct(req, res) {
//     try {
//         // Find the product by ID and populate category
//         const product = await productModel
//             .findById(req.params.id)
//             .populate('category'); // Fixed typo: "catagory" -> "category"

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 error: true,
//                 message: "Product not found"
//             });
//         }

//         // Delete images from Cloudinary
//         const images = product.images || [];

//         if (images.length > 0) {
//             try {
//                 // Process all image deletions concurrently
//                 const deletePromises = images.map(async (imgUrl) => {
//                     try {
//                         // Extract public ID from Cloudinary URL
//                         const urlArr = imgUrl.split('/');
//                         const image = urlArr[urlArr.length - 1];
//                         const publicId = image.split('.')[0];

//                         // Delete from Cloudinary if publicId exists
//                         if (publicId) {
//                             await cloudinary.uploader.destroy(
//                                 `products/${product._id}/${publicId}`, // Assuming folder structure
//                                 { resource_type: 'image' }
//                             );
//                         }
//                     } catch (imgError) {
//                         console.error(`Failed to delete image ${imgUrl}:`, imgError);
//                         // Continue with other deletions even if one fails
//                     }
//                 });

//                 // Wait for all image deletions to complete
//                 await Promise.all(deletePromises);
//             } catch (cloudinaryError) {
//                 console.error('Error during Cloudinary deletion:', cloudinaryError);
//                 // Continue with product deletion even if image deletion fails
//             }
//         }

//         // Delete the product from database
//         const deletedProduct = await productModel.findByIdAndDelete(req.params.id);

//         if (!deletedProduct) {
//             return res.status(404).json({
//                 success: false,
//                 error: true,
//                 message: "Product not found during deletion"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             error: false,
//             message: "Product deleted successfully"
//         });

//     } catch (error) {
//         console.error('Error in deleteProduct:', error);
//         return res.status(500).json({
//             success: false,
//             error: true,
//             message: "Failed to delete product",
//             details: error.message
//         });
//     }
// }

// // Get count of products with various filters
// export async function getProductsCount(req, res) {
//     try {
//         // Count all products
//         const totalCount = await productModel.countDocuments();

//         // Count featured products
//         const featuredCount = await productModel.countDocuments({ isFeatured: true });

//         // Count products in stock
//         const inStockCount = await productModel.countDocuments({ countInStock: { $gt: 0 } });

//         // Count products by category (optional detailed view)
//         const countByCategory = [];
//         if (req.query.detailed === 'true') {
//             // Get all unique categories from products
//             const categories = await productModel.distinct('category');

//             // Count products for each category
//             for (const categoryId of categories) {
//                 const productCount = await productModel.countDocuments({ category: categoryId });
//                 const category = await productModel.findOne({ category: categoryId })
//                     .populate('category', 'name');

//                 countByCategory.push({
//                     categoryId: categoryId,
//                     categoryName: category?.category?.name || 'Unknown',
//                     productCount
//                 });
//             }
//         }

//         return res.status(200).json({
//             success: true,
//             counts: {
//                 total: totalCount,
//                 featured: featuredCount,
//                 inStock: inStockCount,
//                 ...(req.query.detailed === 'true' && { byCategory: countByCategory })
//             }
//         });

//     } catch (error) {
//         console.error('Error in getProductsCount:', error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Failed to fetch product counts"
//         });
//     }
// }


// import productModel from '../models/productModel.js';

// export async function getAllProducts(req, res) {
//   try {
//     // Extract query parameters for filtering, sorting, and pagination
//     const {
//       page = 1,
//       limit = 10,
//       sort = 'dateCreated',
//       order = 'desc',
//       category,
//       brand,
//       minPrice,
//       maxPrice,
//       inStock,
//       isFeatured,
//       search
//     } = req.query;

//     // Build query object
//     const query = {};

//     // Filter by category
//     if (category) {
//       query.category = category;
//     }

//     // Filter by brand
//     if (brand) {
//       query.brand = brand;
//     }

//     // Filter by price range
//     if (minPrice || maxPrice) {
//       query.price = {};
//       if (minPrice) query.price.$gte = Number(minPrice);
//       if (maxPrice) query.price.$lte = Number(maxPrice);
//     }

//     // Filter by stock status
//     if (inStock === 'true') {
//       query.countInStock = { $gt: 0 };
//     } else if (inStock === 'false') {
//       query.countInStock = 0;
//     }

//     // Filter by featured status
//     if (isFeatured === 'true') {
//       query.isFeatured = true;
//     } else if (isFeatured === 'false') {
//       query.isFeatured = false;
//     }

//     // Search by name or description
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Calculate pagination
//     const pageNum = parseInt(page);
//     const limitNum = parseInt(limit);
//     const skip = (pageNum - 1) * limitNum;

//     // Define sort object
//     const sortOptions = {};
//     sortOptions[sort] = order === 'desc' ? -1 : 1;

//     // Execute queries concurrently
//     const [products, totalCount] = await Promise.all([
//       productModel
//         .find(query)
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(limitNum)
//         .populate('category', 'name catName'), // Populate category with specific fields
//       productModel.countDocuments(query)
//     ]);

//     // Prepare response data
//     const totalPages = Math.ceil(totalCount / limitNum);

//     return res.status(200).json({
//       success: true,
//       data: {
//         products,
//         pagination: {
//           currentPage: pageNum,
//           totalPages,
//           totalItems: totalCount,
//           itemsPerPage: limitNum,
//           hasNextPage: pageNum < totalPages,
//           hasPrevPage: pageNum > 1
//         }
//       },
//       message: "Products retrieved successfully"
//     });

//   } catch (error) {
//     console.error('Error in getAllProducts:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to retrieve products",
//       error: error.message
//     });
//   }
// }


// export async function deleteImages(req, res) {
//   try {
//     // Get product ID from params and images to delete from body
//     const { productId } = req.params;
//     const { imagesToDelete } = req.body; // Expecting an array of image URLs

//     // Validate inputs
//     if (!productId) {
//       return res.status(400).json({
//         success: false,
//         message: "Product ID is required"
//       });
//     }

//     if (!imagesToDelete || !Array.isArray(imagesToDelete) || imagesToDelete.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Images to delete must be provided as a non-empty array"
//       });
//     }

//     // Find the product
//     const product = await productModel.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     // Verify all requested images exist in the product
//     const currentImages = product.images || [];
//     const invalidImages = imagesToDelete.filter(img => !currentImages.includes(img));
//     if (invalidImages.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Some images to delete were not found in the product",
//         invalidImages
//       });
//     }

//     // Delete images from Cloudinary
//     const deletionResults = [];
//     const deletePromises = imagesToDelete.map(async (imgUrl) => {
//       try {
//         // Extract public ID from Cloudinary URL
//         const urlArr = imgUrl.split('/');
//         const image = urlArr[urlArr.length - 1];
//         const publicId = image.split('.')[0];
        
//         if (publicId) {
//           const result = await cloudinary.uploader.destroy(
//             `products/${productId}/${publicId}`,
//             { resource_type: 'image' }
//           );
//           deletionResults.push({
//             url: imgUrl,
//             status: 'success',
//             result
//           });
//         }
//       } catch (error) {
//         console.error(`Failed to delete image ${imgUrl} from Cloudinary:`, error);
//         deletionResults.push({
//           url: imgUrl,
//           status: 'failed',
//           error: error.message
//         });
//       }
//     });

//     // Wait for all Cloudinary deletions
//     await Promise.all(deletePromises);

//     // Update product by removing the images
//     const updatedProduct = await productModel.findByIdAndUpdate(
//       productId,
//       { $pull: { images: { $in: imagesToDelete } } },
//       { new: true }
//     ).populate('category');

//     if (!updatedProduct) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to update product after image deletion"
//       });
//     }

//     // Check if any deletions failed
//     const failedDeletions = deletionResults.filter(result => result.status === 'failed');

//     return res.status(200).json({
//       success: failedDeletions.length === 0,
//       message: failedDeletions.length === 0 
//         ? "Images deleted successfully" 
//         : "Some images were deleted, but there were issues",
//       data: {
//         updatedProduct,
//         deletionResults
//       }
//     });

//   } catch (error) {
//     console.error('Error in deleteImages:', error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete images",
//       error: error.message
//     });
//   }
// }


