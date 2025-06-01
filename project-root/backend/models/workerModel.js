import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "seller"],
    default: "seller",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

const Worker = mongoose.model("Worker", workerSchema);
export { Worker };
export default Worker;
