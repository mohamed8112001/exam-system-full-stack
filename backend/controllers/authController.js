const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!["student", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid Role" });
    }
    const user = await User.create({
      username,
      email,
      password_hash: password,
      role,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // -password-hashed    ==>  to not send the password in response
    const user = await User.findById(req.user.user_id).select("-password_hash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Successfully", data: user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
