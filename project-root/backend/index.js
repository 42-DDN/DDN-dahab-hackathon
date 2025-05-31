import express from "express";
import dotenv from "dotenv";
import { sellerRouter } from "./routes/sellerRoute.js";
import { adminRouter } from "./routes/adminRoute.js";
import connectDB from "./config/db.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

connectDB();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/seller", sellerRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
