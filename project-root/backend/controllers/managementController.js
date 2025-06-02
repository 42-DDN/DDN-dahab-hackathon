import Worker from "../models/workerModel.js";
import Item from "../models/itemSchema.js";
import dotenv from "dotenv";
dotenv.config();

const getItem = async (req, res) => {
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
};

const newItem = async (req, res) => {
  const { type, karat, weight, origin, buyPrice, manufacturePrice } = req.body;
  const sellerInfo = req.session.user.id;
  console.log(req.body, sellerInfo);
  if (
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
      type,
      karat,
      weight,
      origin,
      buyPrice,
      manufacturePrice,
      sellerInfo,
    });
    const checkitem = await Item.findById(newItem._id);
    if (checkitem) {
      return res.status(409).json({ message: "Item already exists." });
    }
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getallItems = async (req, res) => {
  try {
    const items = await Item.find().populate("sellerInfo", "name email");
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getAllSellers = async (req, res) => {
  try {
    const sellers = await Worker.find({ role: "seller" }, "name email");
    res.status(200).json(sellers);
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export { getItem, newItem, getallItems, getAllSellers };
