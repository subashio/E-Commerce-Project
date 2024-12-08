import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";
import addressRouter from "./routes/address.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import subCategoryRouter from "./routes/subCategory.routes.js";
import uploadedRouter from "./routes/upload.routes.js";
import userRouter from "./routes/user.routes.js";
import cartRouter from "./routes/cart.routes.js";
dotenv.config();

dotenv.config();

const app = express();
const Port = process.env.PORT || 3000; // Fallback port in case process.env.PORT is undefined

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL, // Default for development
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.get("/", (req, res) => {
  res.json({
    message: `Listening to Port ${Port}`,
  });
});

app.use("/api/user", userRouter);
app.use("/api/address", addressRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/sub-category", subCategoryRouter);
app.use("/api/file", uploadedRouter);
app.use("/api/cart", cartRouter);

// Connecting to the database and running server
connectDB()
  .then(() => {
    app.listen(Port, () => {
      console.log(`Listening To Port: ${Port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
