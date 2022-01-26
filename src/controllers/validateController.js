let mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}

let isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length !== 0
}

let isValidPhone = function(str) {

    if (/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(str)) {
        return true
    }
    return false
}

module.exports = {isValidTitle, isValidRequestBody, isValid, isValidPhone, isValidObjectId}