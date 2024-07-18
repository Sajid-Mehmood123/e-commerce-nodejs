const express = require("express");
const router = express.Router();
const {
  athenticateUser,
  authorizePermessions,
} = require("../middleware/authentication");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/user.controller");

router
  .route("/")
  .get(athenticateUser, authorizePermessions("admin"), getAllUsers);

router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);

router.route("/:id").get(athenticateUser, getSingleUser);

module.exports = router;
