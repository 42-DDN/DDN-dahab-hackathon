import { Router } from "express";
import Item from "../models/itemSchema.js";
import {
  getAllTransactions,
  transactionProcessor,
} from "../controllers/transactionController.js";
import { authentication } from "../middleware/authentication.js";

const sellerRouter = Router();

sellerRouter.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  res.status(200).json({
    message: "Welcome to the seller dashboard",
  });
});

sellerRouter.post("/transaction", authentication, transactionProcessor);
sellerRouter.get("/get-all-transactions", authentication, getAllTransactions);

export { sellerRouter };
