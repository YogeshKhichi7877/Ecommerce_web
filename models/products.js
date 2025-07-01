// import mongoose from 'mongoose' ;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true, // e.g., TV, Fridge, etc.
  },
  details: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required : true }
}, { timestamps: true });

module.exports = mongoose.model('Products' , productSchema);

//export const Products = mongoose.model('Products', productSchema);

