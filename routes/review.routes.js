const express = require("express");
const router = express.Router();
const { athenticateUser } = require("../middleware/authentication");

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

router.route("/").post(athenticateUser, createReview).get(getAllReviews);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(athenticateUser, updateReview)
  .delete(athenticateUser, deleteReview);

module.exports = router;
