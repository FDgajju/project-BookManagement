const BookModel = require("../models/BookModel.js")
const ReviewModel = require("../models/ReviewModel.js")
const mongoose = require('mongoose')
let validator = require('./validateController')

//POST review /books/:bookId/review---------------->
const bookReview = async function (req, res) {
    try {

        const requestBody = req.body
        const bookId = req.params.bookId

        if(!validator.isValidObjectId(bookId)){
            res.status(400).send({status: false, message: `${bookId} this is not valid book id please! check`})
            return
        }

        const book = await BookModel.findOne({ _id: bookId, isDeleted: false })

        if (!book) {
            res.status(404).send({ status: false, message: `book not found` })
            return
        }

        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'request body is not found' })
        }

        //extract params
        const { reviewedBy, reviews, rating, isDeleted } = requestBody


        if (!validator.isValid(reviews)) {
            res.status(400).send({ status: false, message: 'reviews required' })
            return
        }

        if (!validator.isValid(rating)) {
            res.status(400).send({ status: false, message: 'rating required' })
            return
        }

        if (!((rating > 0) && (rating < 6))) {
            res.status(400).send({ status: false, message: 'rating is not in required range' })
            return
        }
        //validation end

        const ReviewData = { reviewedBy, reviews, rating, isDeleted, bookId }

        let savedReview = await ReviewModel.create(ReviewData)
        await BookModel.findOneAndUpdate({ _id: bookId }, { $inc: { "reviews": 1 } }, { new: true })
        res.status(200).send({ status: true, message: 'Review created successfully', data: savedReview })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })

    }
}


//PUT update books by ID /books/:bookId/review/:reviewId
const updateReviews = async function (req, res) {
    try {
        let reqBody = req.body;
        let reqParam = req.params;
        let reviewId = reqParam.reviewId;
        let bookId = reqParam.bookId;

        if (!validator.isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "No parameters passed. Review unmodified" });
            return;
        }

        if (!validator.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` });
            return;
        }

        if (!validator.isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: `${reviewId} is not a valid review id` });
            return;
        }

        const findBooks = await BookModel.findOne({ _id: bookId, isDeleted: false });

        if (!findBooks) {
            res.status(404).send({ status: false, message: "no books found" });
            return;
        }

        const findReviews = await ReviewModel.findOne({ _id: reviewId, isDeleted: false });

        if (!findReviews) {
            res.status(404).send({ status: false, message: "no reviews found" });
            return;
        }

        const { reviews, rating, reviewedBy } = reqBody;

        if (!validator.isValid(rating)) {

            res.status(400).send({ status: false, message: "please! enter valid rating" });
            return;
        }


        if (!(rating > 0 && rating < 6)) {
            res.status(400).send({ status: false, message: "rating must be 1 to 5" });
            return;
        }

        let updateData = { reviews, rating, reviewedBy };

        let getUpdateReview = await ReviewModel.findOneAndUpdate({ _id: reviewId },
            { reviews: reviews, rating: rating, reviewedBy: reviewedBy }, { new: true });
        res.status(200).send({ status: true, message: "review successfully Updated", data: getUpdateReview });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

//DELETE book by Id /books/:bookId/review/:reviewId ------------------------->
const deleteReviewOfBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if (!validator.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: "please! enter valid book Id" })
            return
        }
        if (!validator.isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: "please! enter valid review Id" })
            return
        }
        let findReview = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })
        let findBook = await BookModel.findOne({ _id: bookId, isDeleted: false })

        if (!findReview) {
            return res.status(404).send({ status: false, msg: `no reviews found with this ${reviewId} id` })
        }
        if (!findBook) {
            return res.status(404).send({ status: false, msg: `no book found with this ${bookId} id` })
        }

        let deleteReview = await ReviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, { isDeleted: true, deletedAt: Date() })
        if (deleteReview) {
            res.status(200).send({ status: true, msg: 'review is deleted successful' })

            await BookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } })
            return
        } else {
            res.status(404).send({ status: false, msg: "review not present" })
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {bookReview, updateReviews, deleteReviewOfBook}










