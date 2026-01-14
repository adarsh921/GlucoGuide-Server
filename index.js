import dotenv from "dotenv";
import express from "express";
import mealRoutes from "./routes/mealRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vitalsRoutes from "./routes/vitalsRoutes.js";
import mongoose from "mongoose";
import cors from 'cors';
dotenv.config();

mongoose
  .connect("mongodb+srv://cyber13jan:Y7Wr6Qhsw0694mhu@glucoguidedb.rybgvky.mongodb.net/?appName=GlucoGuideDB", {
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

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "GlucoGuide Backend",
    timestamp: new Date().toISOString(),
  });
});


app.use(
  cors({
    origin: "https://glucoguide.netlify.app/",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/meals", mealRoutes);
app.use("/api/auth",userRoutes);
app.use('/api/vitals',vitalsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running"));
