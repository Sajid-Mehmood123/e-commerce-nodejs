const express = require("express");
const router = express.Router();
const {
  athenticateUser,
  authorizePermessions,
} = require("../middleware/authentication");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/produt.controller");
const { getSingleProductReviews } = require("../controllers/review.controller");

router
  .route("/")
  .post([athenticateUser, authorizePermessions("admin")], createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([athenticateUser, authorizePermessions("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([athenticateUser, authorizePermessions("admin")], updateProduct)
  .delete([athenticateUser, authorizePermessions("admin")], deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
