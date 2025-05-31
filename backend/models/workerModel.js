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
  role: {
    type: String,
    enum: ["admin", "seller"],
    default: "seller",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date.now(),
  },
});

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
