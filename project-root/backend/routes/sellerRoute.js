import { Router } from "express";

const sellerRouter = Router();

sellerRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the seller dashboard",
  });
});

export { sellerRouter };
