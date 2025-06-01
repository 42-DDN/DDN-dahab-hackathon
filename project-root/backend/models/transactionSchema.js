import mongoose from "mongoose";

const transcationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  dateOfSale: {
    type: Date,
    default: Date.now,
  },
  goldPrice: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["cash", "card", "bank transfer"],
    required: true,
  },
  soldItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  ],
  tax: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transcationSchema);

export default Transaction;
