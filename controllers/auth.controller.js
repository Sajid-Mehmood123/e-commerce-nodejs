const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  // existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError.BadRequestError("Email already exist");
  }

  const isFirstAccout = (await User.countDocuments({})) === 0;
  const role = isFirstAccout ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  const token = jwt.sign(tokenUser, "jwtsecret", { expiresIn: "7d" });

  res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};
const login = async (req, res) => {
  res.send("login user");
};
const logout = async (req, res) => {
  res.send("logout user");
};

module.exports = { register, login, logout };
