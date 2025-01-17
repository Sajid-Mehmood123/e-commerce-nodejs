const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createUserToken,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ total: users.length, users });
};
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`User not found with this id ${_id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// update user with save() method
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({
    _id: req.user.userId,
  });

  (user.email = email), (user.name = name);

  await user.save();

  const tokenUser = createUserToken(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Success! password updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError("Please provide both values");
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );

//   const tokenUser = createUserToken(user);
//   attachCookiesToResponse({ res, user: tokenUser });

//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
