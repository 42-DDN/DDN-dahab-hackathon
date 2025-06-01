import Worker from "../models/workerModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@admin.com" && password === process.env.ADMIN_PASSWORD) {
    req.session.user = { email, role: "admin" };
    req.session.save();
	  return res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  }

  try {
    const user = await Worker.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "seller") {
      return res.status(403).json({ message: "Access denied. Not a seller." });
    }
	      req.session.save();
    req.session.user = { id: user.id, role: "seller" };
    return res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await Worker.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Worker({
      name,
      email,
      password: hashedPassword,
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
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
};
export { login, signup, logout };
