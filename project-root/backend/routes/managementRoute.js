import { Router } from "express";
import Item from "../models/itemSchema.js";
const managementRouter = Router();
import { authentication } from "../middleware/authentication.js";
import {
  getallItems,
  getItem,
  newItem,
} from "../controllers/managementController.js";

managementRouter.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  res.status(200).json({
    message: "Welcome to the management dashboard",
  });
});

managementRouter.post("/getitem", authentication, getItem);

managementRouter.post("/newitem", authentication, newItem);

managementRouter.get("/getallitems", authentication, getallItems);

export { managementRouter };
