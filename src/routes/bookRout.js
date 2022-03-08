const express = require("express");

const router = express.Router();

const {
  createBooks,
  getBooks,
  update,
  getBookWithReview,
  deleteBookByID,
} = require("../controllers/bookController");

const { Auth } = require("../middleware/Authentication");

router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});

//BOOK API
router.post("/", Auth, createBooks); //authorization
router.get("/", Auth, getBooks); //
router.put("/:bookId", Auth, update); //authorization
router.get("/:bookId", Auth, getBookWithReview);
router.delete("/:bookId", Auth, deleteBookByID); //authorization
//router.delete('/books/:bookId',bookController.deleteBookByID)

module.exports = router;
