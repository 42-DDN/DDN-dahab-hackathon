import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    dateOfSale: {
      type: Date,
      default: Date.now,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

invoiceSchema.pre("save", async function (next) {
  if (this.item) {
    const Item = this.model("Item");
    const itemDoc = await Item.findById(this.item);
    if (itemDoc) {
      this.totalPrice = itemDoc.weight * itemDoc.goldPrice;
    }
  }
  next();
});
