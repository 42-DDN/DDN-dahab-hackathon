import { Router } from "express";
import dotenv from "dotenv";
import { Worker } from "../models/workerModel.js";
import { authentication } from "../middleware/authentication.js";
import { login } from "../controllers/loginController.js";
dotenv.config();
const loginRouter = Router();

loginRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the login dashboard",
  });
});

loginRouter.post("/login", login);

loginRouter.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await Worker.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new Worker({
      name,
      email,
      password,
      role,
    });

    await newUser.save();
    req.session.user = { id: newUser.id, role: newUser.role };
    return res
      .status(201)
      .json({ message: "Signup successful", user: req.session.user });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

loginRouter.post("/logout", authentication, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

export { loginRouter };
