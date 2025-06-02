import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  type: {
    type: String,
    required: true,
  },
  karat: {
    type: String,
    required: true,
    enum: ["24k", "21k", "18k", "14k", "24K", "21K", "18K", "14K"], // Accept both cases
  },
  manufacturePrice: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  buyPrice: {
    type: Number,
    required: true,
  },
  sellerInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true,
  },
  sold: {
    type: Boolean,
    default: false,
  },
});

const Item = mongoose.model("Item", ItemSchema);
export default Item;
