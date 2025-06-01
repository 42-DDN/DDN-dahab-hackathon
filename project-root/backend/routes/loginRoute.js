import { Router } from "express";
import dotenv from "dotenv";
import { authentication } from "../middleware/authentication.js";
import { login, signup, logout } from "../controllers/loginController.js";
dotenv.config();
const loginRouter = Router();

loginRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the login dashboard",
  });
});

loginRouter.post("/login", login);

loginRouter.post("/signup", signup);

loginRouter.post("/logout", authentication, logout);

export { loginRouter };
