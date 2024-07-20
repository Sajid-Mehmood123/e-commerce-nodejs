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

router.route("/showMe").get(athenticateUser, showCurrentUser);
router.route("/updateUser").patch(athenticateUser, updateUser);
router.route("/updateUserPassword").patch(athenticateUser, updateUserPassword);

router.route("/:id").get(athenticateUser, getSingleUser);

module.exports = router;
