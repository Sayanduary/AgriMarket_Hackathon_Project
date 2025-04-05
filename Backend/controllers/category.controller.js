import dotenv from 'dotenv';
dotenv.config();

import { CategoryModel } from "../models/category.model.js"; 
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});


export async function createCategory(req, res) {
  try {
    const { name, parentId } = req.body;
    
    // Check if name is provided
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    
    // Setup for new category
    const categoryData = {
      name,
      parentId: null,
      parentCatName: null
    };
    
    // If parentId is provided, fetch and verify the parent category
    if (parentId) {
      const parentCategory = await CategoryModel.findById(parentId);
      if (!parentCategory) {
        return res.status(404).json({ success: false, message: 'Parent category not found' });
      }
      // Update category data with parent information
      categoryData.parentId = parentId;
      categoryData.parentCatName = parentCategory.name;
    }
    
    // Create and save the new category
    const newCategory = new CategoryModel(categoryData);
    await newCategory.save();
    
    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


export async function getCategories(req, res) {
  try {
    const { parentId } = req.query;
    let query = {};
    
    // If parentId is provided, filter categories by parent
    if (parentId) {
      query.parentId = parentId;
    }
    
    // For root categories, allow explicit filtering
    if (parentId === 'null' || parentId === 'root') {
      query.parentId = null;
    }
    
    // Fetch categories based on the query
    const categories = await CategoryModel.find(query).sort({ name: 1 });
    
    // Return response
    return res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}


export async function uploadCategoryImages(req, res) {
  try {
    // Check if files are present
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // Get category ID from the params
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({ success: false, message: "Category ID is required" });
    }

    // Verify the category exists before attempting to upload
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Prepare to upload each image to Cloudinary
    const uploadedImages = [];
    
    for (const file of req.files) {
      const filePath = file.path;
      try {
        // Upload each file to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          folder: `categories/${categoryId}` // Organize images by category
        });
        
        uploadedImages.push(result.secure_url);
      } catch (uploadError) {
        console.error(`Error uploading file: ${filePath}`, uploadError);
        // Continue with other files even if one fails
      } finally {
        // Clean up the local file after upload attempt
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // If no images were successfully uploaded
    if (uploadedImages.length === 0) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to upload any images" 
      });
    }

    // Update the category with the uploaded images
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { $push: { images: { $each: uploadedImages } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Category images uploaded successfully",
      category: updatedCategory,
      uploadedImages: uploadedImages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
}

export async function getCategoriesCount(req, res) {
  try {
    // Count all categories
    const totalCount = await CategoryModel.countDocuments();
    
    // Count root categories (categories with no parent)
    const rootCount = await CategoryModel.countDocuments({ parentId: null });
    
    // Count subcategories (categories with a parent)
    const subCategoryCount = await CategoryModel.countDocuments({ parentId: { $ne: null } });
    
    // Get count by parent (optional)
    const countByParent = [];
    if (req.query.detailed === 'true') {
      // Find all parent categories
      const parentCategories = await CategoryModel.find({ parentId: null });
      
      // For each parent, count its children
      for (const parent of parentCategories) {
        const childCount = await CategoryModel.countDocuments({ parentId: parent._id });
        countByParent.push({
          parentId: parent._id,
          parentName: parent.name,
          childCount
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      counts: {
        total: totalCount,
        rootCategories: rootCount,
        subCategories: subCategoryCount,
        ...(req.query.detailed === 'true' && { byParent: countByParent })
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch category counts"
    });
  }
}

export async function getSubcategoryCount(req, res) {
  try {
    const { parentId } = req.params;
    
    // Validate that parentId is provided
    if (!parentId) {
      return res.status(400).json({
        success: false,
        message: "Parent category ID is required"
      });
    }
    
    // Check if parent category exists
    const parentCategory = await CategoryModel.findById(parentId);
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found"
      });
    }
    
    // Count subcategories for this parent
    const subcategoryCount = await CategoryModel.countDocuments({ parentId });
    
    // Get list of subcategories if detailed flag is provided
    let subcategories = [];
    if (req.query.detailed === 'true') {
      subcategories = await CategoryModel.find({ parentId })
        .select('_id name images')
        .sort({ name: 1 });
    }
    
    return res.status(200).json({
      success: true,
      parentCategory: {
        _id: parentCategory._id,
        name: parentCategory.name
      },
      count: subcategoryCount,
      ...(req.query.detailed === 'true' && { subcategories })
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch subcategory count"
    });
  }
}

export async function getSingleCategory(req, res) {
  try {
    const { id } = req.params;
    
    // Validate that id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }
    
    // Find the requested category
    const category = await CategoryModel.findById(id);
    
    // Check if category exists
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      category: {
        _id: category._id,
        name: category.name,
        description: category.description,
        images: category.images,
        parentId: category.parentId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch category"
    });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    
    // Validate that id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }
    
    // Check if category exists
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    
    // Check if category has subcategories
    const subcategoryCount = await CategoryModel.countDocuments({ parentId: id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with subcategories. Remove all subcategories first."
      });
    }
    
    // Check if category is in use by products (if applicable)
    // Uncomment if you have a ProductModel with category references
    /*
    const productsWithCategory = await ProductModel.countDocuments({ categoryId: id });
    if (productsWithCategory > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with associated products. Remove all products first."
      });
    }
    */
    
    // Delete the category
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    // If this was a subcategory (had a parentId), you might want to update counts or other metadata
    if (category.parentId) {
      // Optional: Update parent category metadata if needed
      // await CategoryModel.findByIdAndUpdate(category.parentId, { $inc: { subcategoryCount: -1 } });
    }
    
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory: {
        _id: deletedCategory._id,
        name: deletedCategory.name,
        wasSubcategory: !!category.parentId,
        parentId: category.parentId || null
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete category"
    });
  }
}