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
import orderRouter from "./routes/order.routes.js";
import viewedProductRouter from "./routes/viewedProducts.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import variantRouter from "./routes/variant.routes.js";
import { injectSpeedInsights } from "@vercel/speed-insights";
dotenv.config();

const app = express();
const Port = process.env.PORT; // Fallback port in case process.env.PORT is undefined

injectSpeedInsights();
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Default for development
    credentials: true,
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
    message: `Hello Wellcome to server, Listening to Port ${Port}`,
  });
});

app.use("/api/user", userRouter);
app.use("/api/address", addressRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/sub-category", subCategoryRouter);
app.use("/api/file", uploadedRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/viewed-products", viewedProductRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/variant", variantRouter);
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
