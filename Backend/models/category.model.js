import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    trim: true,
  },
  images: [
    {
      type: String
    }
  ],
  parentCatName:
  {
    type: String,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  }
}, { timestamps: true })

export const CategoryModel = mongoose.model('Category', categorySchema);