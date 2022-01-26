const express = require('express');

const router = express.Router();

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const ReviewController = require("../controllers/ReviewController")
const Middleware = require("../middleware/Authentication")

router.get('/test-me', function (req, res) {
  res.send('My first ever api!')
});

//USER API
router.post('/User', userController.registerUser)
router.post('/login', userController.login)


//BOOK API  
router.post('/books', Middleware.Auth, bookController.createBooks) //authorization

router.get('/books', Middleware.Auth, bookController.getBooks)//
router.put('/books/:bookId', Middleware.Auth, bookController.update) //authorization
router.get('/books/:bookId', Middleware.Auth, bookController.getBookWithReview)

router.delete('/books/:bookId', Middleware.Auth, bookController.deleteBookByID) //authorization
//router.delete('/books/:bookId',bookController.deleteBookByID) 

//Review API 
router.post('/books/:bookId/review', ReviewController.bookReview)
router.put('/books/:bookId/review/:reviewId', ReviewController.updateReviews)
router.delete('/books/:bookId/review/:reviewId', ReviewController.deleteReviewOfBook)


module.exports = router;