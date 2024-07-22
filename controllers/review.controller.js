const Review = require("../models/review.model");
const Product = require("../models/product.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `no product found with this id ${productId}`
    );
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already Submmited review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.OK).json({ totalCount: reviews.length, reviews });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(
      `no review found with this id ${reviewId}`
    );
  }
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with this id ${reviewId}`
    );
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOneAndDelete({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(
      `no review found with this id ${reviewId}`
    );
  }

  checkPermissions(req.user, review.user);

  res.status(StatusCodes.OK).json({ msg: "success! Review removed" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
