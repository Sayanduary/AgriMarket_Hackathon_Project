import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [
    {
      type: String,
      required: true,
    }
  ],
  brand: {
    type: String,
    default: '',
  },
  price: {
    type: Number,

  }
}, { timestamps: true })