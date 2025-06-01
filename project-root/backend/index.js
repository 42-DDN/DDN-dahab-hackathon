import express from "express";
import dotenv from "dotenv";
import { sellerRouter } from "./routes/sellRoute.js";
import { adminRouter } from "./routes/loginRoute.js";
import connectDB from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

connectDB();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api/seller", sellerRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
