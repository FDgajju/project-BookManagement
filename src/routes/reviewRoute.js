const express = require("express");

const router = express.Router();

const {
  bookReview,
  updateReviews,
  deleteReviewOfBook,
} = require("../controllers/ReviewController");

router.post("/:bookId/review", bookReview);
router.put("/:bookId/review/:reviewId", updateReviews);
router.delete("/:bookId/review/:reviewId", deleteReviewOfBook);

module.exports = router;