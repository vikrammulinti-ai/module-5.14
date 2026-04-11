import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ✅ REGISTER
export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ email, password });

  res.status(200).json(user);
};

// ✅ LOGIN (THIS MUST EXIST)
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, { httpOnly: true });

  res.status(200).json({ message: "Logged in" });
};