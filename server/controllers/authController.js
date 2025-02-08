const User = require("../models/user");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.json({ message: "User already exists", success: false });
  const user = new User({ name, email, password });
  await user.save();
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: "User registered successfully",
      success: true,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found", success: false });
  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({ message: "Invalid password", success: false });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
    message: "User logged in successfully",
    success: true,
  });
};

module.exports = { registerUser, loginUser };
