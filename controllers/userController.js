import User from "../models/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, age, gender, diabetesType } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
      name: username,
      email,
      password: hash,
      age,
      gender,
      diabetesType,
    });
    const savedUser = await user.save();
    const token = jwt.sign({ userId: savedUser._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "user registered successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    
  } catch (error) {}
};
