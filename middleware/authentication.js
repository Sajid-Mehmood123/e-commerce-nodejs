const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const athenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Athentication Invalid");
  }

  try {
    // const payload = isTokenValid({ user });
    // req.user = { name: user.name, userId: user._id, role: user.role };

    // destructure name, userId and role
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Athentication Invalid");
  }
  next();
};

const authorizePermessions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = { athenticateUser, authorizePermessions };
