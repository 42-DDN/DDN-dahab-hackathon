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
    default: new Date.now(),
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

// workerSchema.pre("save", (next) =>
// {
//   if (this.role === "admin")
//   {
//     if ()
//   }
// }
const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
