import dotenv from "dotenv";
import express from "express";
import mealRoutes from "./routes/mealRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mongoose from "mongoose";
dotenv.config();
mongoose
  .connect("mongodb://localhost:27017/GlucoGuide", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => console.error("connection error",err));

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());
app.use("/api/meals", mealRoutes);
app.use("/api/auth",userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running"));
