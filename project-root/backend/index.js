import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sellerRouter } from "./routes/sellRoute.js";
import { loginRouter } from "./routes/loginRoute.js";
import connectDB from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { managementRouter } from "./routes/managementRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

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
      httpOnly: false,
      secure: false,
    },
    name: "sessionId",
  })
);

app.use("/api/seller", sellerRouter);
app.use("/api/auth", loginRouter);
app.use("/api/management", managementRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
