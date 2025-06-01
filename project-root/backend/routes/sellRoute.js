import { Router } from "express";

const sellerRouter = Router();

sellerRouter.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  res.status(200).json({
    message: "Welcome to the seller dashboard",
  });
});

export { sellerRouter };
