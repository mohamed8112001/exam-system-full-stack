const jwt = require("jsonwebtoken");

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
      req.user = decoded;

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
