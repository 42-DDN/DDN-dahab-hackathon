import Transaction from "../models/transactionSchema.js";
import Item from "../models/itemSchema.js";
import dotenv from "dotenv";

dotenv.config();

const transactionProcessor = async (req, res) => {
  const { itemIds, paymentMethod, tax, goldPrice, totalPrice } = req.body;

  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({
      message: "Invalid or missing item IDs",
    });
  }

  try {
    for (const id of itemIds) {
      const item = await Item.findById(id);
      if (!item) {
        return res.status(404).json({
          message: `Item not found for ID: ${id}`,
        });
      }
    }

    if (!paymentMethod || typeof paymentMethod !== "string") {
      return res.status(400).json({
        message: "Invalid or missing payment method",
      });
    }

    if (typeof tax !== "number" || tax < 0) {
      return res.status(400).json({
        message: "Invalid or missing tax",
      });
    }

    if (typeof goldPrice !== "number" || goldPrice < 0) {
      return res.status(400).json({
        message: "Invalid or missing gold price",
      });
    }

    const transaction = new Transaction({
      soldItems: itemIds,
      paymentType: paymentMethod,
      tax,
      goldPrice,
      sellerInfo: req.session.user.id,
      totalPrice: totalPrice,
    });
    await transaction.save();
    return res.status(200).json({
      message: "Transaction successful",
      itemIds,
      paymentType: paymentMethod,
      tax,
      goldPrice,
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { transactionProcessor };
