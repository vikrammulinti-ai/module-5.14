import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded.id;

  next();
};
