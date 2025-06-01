import { Router } from "express";
import Item from "../models/itemSchema.js";
const managementRouter = Router();
import { authentication } from "../middleware/authentication";

managementRouter.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  res.status(200).json({
    message: "Welcome to the management dashboard",
  });
});

managementRouter.post("/qr-getitem", authentication, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ message: "Item ID is required." });
  }
  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

managementRouter.post("/qr-newitem", authentication, async (req, res) => {
  const {
    category,
    type,
    karat,
    weight,
    origin,
    buyPrice,
    manufacturePrice,
    sellerInfo,
  } = req.body;
  if (
    !category ||
    !type ||
    !karat ||
    !weight ||
    !origin ||
    !buyPrice ||
    !manufacturePrice ||
    !sellerInfo
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const newItem = new Item({
      category,
      type,
      karat,
      weight,
      origin,
      buyPrice,
      manufacturePrice,
      sellerInfo,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export { managementRouter };
