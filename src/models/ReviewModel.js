//ReviewModel.js
const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({

    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'bookId is required',
        ref: 'Books'
    },


    reviewedBy: {
        type: String,
        required: 'view is required',
        default: 'Guest',
        // value: {
        //     typeId: objectId,
        //     ref: "User"
        // }
        trim: true
    },

    reviewedAt: {
        type: Date,
        require: "When was Reviewed?",
        default: Date.now()

    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        trim: true
    },
    reviews: {
        type: String,
        trim: true
        //default: null
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

})
// },{ timestamps: true })

module.exports = mongoose.model('Review', ReviewSchema)