import { Router } from "express";
import Item from "../models/itemSchema.js";
import { transactionProcessor } from "../controllers/transactionController.js";

const sellerRouter = Router();

sellerRouter.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  res.status(200).json({
    message: "Welcome to the seller dashboard",
  });
});

sellerRouter.post("/transaction", transactionProcessor);

export { sellerRouter };
