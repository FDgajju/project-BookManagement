const BookModel = require("../models/BookModel.js");
const UserModel = require("../models/UserModel.js");
const ReviewModel = require("../models/ReviewModel.js");
let validator = require("./validateController");

const createBooks = async function (req, res) {
  try {
    let decodedUserToken = req.user;
    const { body } = req;

    if (!(decodedUserToken.userId === body.userId)) {
      return res
        .status(400)
        .send({ status: "unAuthorized", message: "UnAuthorized access." });
    }

    if (!validator.isValidRequestBody(body)) {
      res.status(400).send({ status: "Invalid", message: "Invalid Fields" });
    }

    //extract params
    const {
      title,
      excerpt,
      userId,
      ISBN,
      category,
      subcategory,
      review,
      releasedAt,
    } = body;

    if (!validator.isValid(title)) {
      res
        .status(400)
        .send({ status: false, message: "book title is required" });
      return;
    }

    if (!validator.isValid(excerpt)) {
      res.status(400).send({ status: false, message: "excerpt required" });
      return;
    }

    if (!validator.isValid(userId)) {
      res.status(400).send({ status: false, message: "userId required" });
      return;
    }

    if (!validator.isValidObjectId(userId)) {
      res.status(400).send({ status: false, message: "object id is required" });
      return;
    }

    if (!validator.isValid(category)) {
      res.status(400).send({ status: false, message: "category required" });
      return;
    }

    if (!validator.isValid(subcategory)) {
      res.status(400).send({ status: false, message: "subcategory required" });
      return;
    }

    if (!validator.isValid(releasedAt)) {
      res.status(400).send({ status: false, message: "releasedAt required" });
      return;
    }

    const isTitleAlreadyUsed = await BookModel.findOne({ title });

    if (isTitleAlreadyUsed) {
      res
        .status(400)
        .send({ status: false, message: `${title} book is already exist` });
      return;
    }

    const isISBNAlreadyUsed = await BookModel.findOne({ ISBN });

    if (isISBNAlreadyUsed) {
      res
        .status(400)
        .send({ status: false, message: `${ISBN} ISBN is already exist` });
      return;
    }

    if (!validator.isValid(userId)) {
      res.status(400).send({ status: false, message: "userId 1 is required" });
      return;
    }

    if (!validator.isValidObjectId(userId)) {
      res
        .status(400)
        .send({ status: false, message: `${userId} 1 is not a valid userId` });
      return;
    }
    let user = await UserModel.findById(userId);

    if (!user) {
      res.status(400).send({ status: false, message: "user_Id not found" });
      return;
    }

    //validation end

    const bookData = {
      title,
      excerpt,
      userId,
      ISBN,
      category,
      subcategory,
      releasedAt: releasedAt ? releasedAt : "releasedAt field is mandatory",
    };
    let savedBook = await BookModel.create(bookData);
    res.status(201).send({
      status: true,
      message: "book created successfully",
      data: savedBook,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// get books by query-------->
const getBooks = async function (req, res) {
  try {
    //const params = req.params

    let filterDel = { isDeleted: false, deletedAt: null };
    let queryPara = req.query;
    // console.log(queryPara.subcategory)

    if (queryPara) {
      if (queryPara.hasOwnProperty("userId")) {
        if (
          !(
            validator.isValid(queryPara.userId) &&
            validator.isValidObjectId(queryPara.userId)
          )
        ) {
          return res.status(400).send({
            status: false,
            message: `${queryPara.userId} is not a valid userId`,
          });
        }
        filterDel["userId"] = queryPara.userId.trim();
      }

      if (queryPara.category) {
        if (!validator.isValid(queryPara.category)) {
          return res.status(400).send({
            status: false,
            message: `${queryPara.category}​​​​​​​​​ is not a valid userId`,
          });
        }
        filterDel.category = queryPara.category.trim();
      }

      if (queryPara.subcategory) {
        if (!validator.isValid(queryPara.subcategory)) {
          return res.status(400).send({
            status: false,
            message: `${queryPara.subcategory}​​​​​​​​​ is not a valid userId`,
          });
        }

        filterDel["subcategory"] = queryPara.subcategory.trim();
      }

      console.log(filterDel);
      let findBooks = await BookModel.find(filterDel).select({
        _id: 1,
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        subcategory: 1,
        releasedAt: 1,
        reviews: 1,
      });

      if (Array.isArray(findBooks) && findBooks.length === 0) {
        res.status(400).send({ status: false, message: "No Books Found" });
        return;
      }

      let sortedByBookName = findBooks.sort(
        (a, b) => (a.title > b.title && 1) || -1
      );

      res.status(200).send({
        status: true,
        message: "is this the book your looking for?",
        data: sortedByBookName,
      });
      return;
    }

    let findNotDel = await BookModel.find({
      isDeleted: false,
      deletedAt: null,
    });

    let sortedByBookTitle = findNotDel.sort(
      (a, b) => (a.title > b.title && 1) || -1
    );
    if (sortedByBookTitle) {
      res.status(200).send({ status: true, data: sortedByBookTitle });
      return;
    }
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

//GET books by Id /books/:bookId ------------------------>
const getBookWithReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;

    if (!validator.isValidObjectId(bookId)) {
      res.status(400).send({ status: false, message: "invalid book ID" });
      return;
    }

    if (!validator.isValid(bookId)) {
      res.status(400).send({
        status: false,
        msg: `Invalid request. No request passed in the query`,
      });
      return;
    }

    let bookDetail = await BookModel.findOne({ _id: bookId }).select({
      ISBN: 0,
    });
    //console.log( bookDetail )
    if (!validator.isValid(bookDetail)) {
      res.status(404).send({ status: false, msg: `invalid book ID` });
      return;
    }

    let reviewsData = await ReviewModel.find({ bookId: bookDetail }).select({
      _id: 1,
      bookId: 1,
      reviewedBy: 1,
      reviewedAt: 1,
      rating: 1,
      reviews: 1,
    });
    //  console.log(reviewsData)
    let data = {
      _id: bookDetail._id,
      title: bookDetail.title,
      excerpt: bookDetail.excerpt,
      userId: bookDetail.userId,
      ISBN: bookDetail.ISBN,
      category: bookDetail.category,
      subcategory: bookDetail.subcategory,
      reviews: bookDetail.reviews,
      deletedAt: bookDetail.deletedAt,
      releasedAt: bookDetail.releasedAt,
      createdAt: bookDetail.createdAt,
      updatedAt: bookDetail.updatedAt,
      reviewsData: reviewsData,
    };
    if (reviewsData.length == 0) {
      res.status(200).send({ status: true, message: "Book List", data: data });
    }

    res.status(200).send({ status: true, message: `bookList`, data: data });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//Put update books by Id /books/:bookId---------------->
const update = async function (req, res) {
  try {
    //const requestBody= req.body
    let decodedUserToken = req.user;
    console.log(req.params);
    let bookUser = await BookModel.findOne({ _id: req.params.bookId });
    console.log(bookUser);
    if (decodedUserToken.userId == bookUser.userId) {
      if (bookUser.isDeleted == true) {
        return res
          .status(404)
          .send({ status: false, msg: "the book has been already deleted" });
      }

      if (bookUser.isDeleted == false && bookUser.deletedAt == null) {
        const isTitleAlreadyUsed = await BookModel.findOne({
          title: req.body.title,
        });

        if (isTitleAlreadyUsed) {
          res.status(400).send({
            status: false,
            message: `${req.body.title} these title is already registered`,
          });
          return;
        }

        const isISBNAlreadyUsed = await BookModel.findOne({
          ISBN: req.body.ISBN,
        });

        if (isISBNAlreadyUsed) {
          res.status(400).send({
            status: false,
            message: `${req.body.ISBN} these ISBN is already registered`,
          });
          return;
        }

        let newData = await BookModel.findOneAndUpdate(
          { _id: bookUser },
          {
            title: req.body.title,
            excerpt: req.body.excerpt,
            ISBN: req.body.ISBN,
            releasedAt: req.body.releasedAt,
          },
          { new: true }
        );

        if (Object.keys(req.body).length == 0) {
          return res.status(400).send({
            status: true,
            message: "which field do you want to update?",
          });
        }

        console.log(newData);

        res.status(200).send({ status: true, data: newData });
      }
    } else {
      res.status(404).send({ err: "The User is Not Authorized" });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//DELETE book by ID /books/:bookId
const deleteBookByID = async function (req, res) {
  try {
    let decodedUserToken = req.user;
    // console.log(decodedUserToken)

    const bookId = req.params.bookId;
    // console.log(bookId)

    if (!validator.isValidObjectId(bookId)) {
      res
        .status(400)
        .send({ status: false, message: `${bookId} is not a valid bookId` });
      return;
    }
    // if(!validator.isValidObjectId(decodedUserToken)) {
    //     res.status(400).send({status: false, message: `${decodedUserToken} is not a valid token id`})
    //     return
    // }
    const deleteBook = await BookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });

    console.log(deleteBook);

    if (!deleteBook) {
      res
        .status(404)
        .send({ status: false, message: `The book has been already deleted` });
      return;
    }

    if (deleteBook.userId === decodedUserToken) {
      res
        .status(401)
        .send({ status: false, msg: `id  not allow to delete book` });
      return;
    }

    await BookModel.findOneAndUpdate(
      { _id: bookId },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );
    res
      .status(200)
      .send({ status: true, message: `bookId deleted successfully` });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createBooks,
  getBooks,
  getBookWithReview,
  update,
  deleteBookByID,
};
