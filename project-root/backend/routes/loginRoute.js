import { Router } from "express";

const adminRouter = Router();

adminRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the admin dashboard",
  });
});

export { adminRouter };
