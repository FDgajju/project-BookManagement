const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: "title is required",
      enum: ["Mr", "Mrs", "Miss"],
    },

    name: {
      type: String,
      required: "name is required",
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      required: "phone number is required",
      unique: true,
    },

    email: {
      type: String,
      required: "email is required",
      unique: true,
      trim: true,
      message: "Please enter a valid email",
    },

    password: {
      type: String,
      required: "password is required",
      minlength: 8,
      maxlength: 15,
    },

    address: {
      street: { type: String },
      city: { type: String },
      pincode: {
        type: String,
      },
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

// const regexphone = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

// const validatephone = function (phone) {
//     return regexphone.test(phone)
// }

// const regexpincode =  "^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$";

// const validatepincode = function(pincode) {
//     return regexpincode.test(pincode)
// }
