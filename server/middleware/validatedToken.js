import jwt from "jsonwebtoken";

const validatedToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
      req.user = jwt.verify(authHeader.slice(7), process.env.ACCESS_TOKEN_SECRET);
      next();
    } catch {
      return res.status(403).json({ success: false, message: "Forbidden: Invalid token" });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export { validatedToken };
