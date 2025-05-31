import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
