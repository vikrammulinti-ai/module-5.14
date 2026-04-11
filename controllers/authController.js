import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
  });

  res.json({ message: "Logged in" });
};
