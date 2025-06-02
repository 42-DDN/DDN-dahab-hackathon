import { Router } from "express";
import Item from "../models/itemSchema.js";
const managementRouter = Router();
import {
  adminAuthentication,
  authentication,
} from "../middleware/authentication.js";
import {
  getallItems,
  getItem,
  newItem,
  getAllSellers,
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

managementRouter.get("/getallsellers", authentication, getAllSellers);
export { managementRouter };
