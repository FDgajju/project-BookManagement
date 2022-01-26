const UserModel = require("../models/UserModel.js")
const jwt = require("jsonwebtoken")
let validator = require('./validateController')

//POST /register
const registerUser = async function (req, res) {
    try {

        const requestBody = req.body

        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'value in request body is required' })
            return
        }

        //extract param
        const { title, name, phone, email, password, address } = requestBody

        if (!validator.isValid(name)) {
            res.status(400).send({ status: false, message: 'name is not valid' })
            return
        }

        if (!validator.isValid(phone)) {
            res.status(400).send({ status: false, message: 'phone is not valid' })
            return
        }

        if (!validator.isValid(title)) {
            res.status(400).send({ status: false, message: 'title is required' })
            return
        }

        if (!validator.isValidTitle(title.trim())) {
            res.status(400).send({ status: false, message: 'title is not valid provide among mr,miss,mrs' })
            return

        }
        if (!validator.isValid(password)) {
            res.status(400).send({ status: false, message: 'password is required' })
            return
        }


        if (!((password.length > 7) && (password.length < 16))) {

            return res.status(400).send({ status: false, message: `Password length should be between 8 and 15.` })
        }//trim
        if (!validator.isValidPhone(phone)) {
            return res.status(400).send({ status: false, msg: "The phone no. is not valid" })
        }

        const isNumberAlreadyUsed = await UserModel.findOne({ phone });
        if (isNumberAlreadyUsed) {
            res.status(400).send({ status: false, message: `your ${phone} number is already used` })
            return
        }

        const isEmailAlreadyUsed = await UserModel.findOne({ email });

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email.trim()} email is already registered` })
            return
        }

        if (!validator.isValid(email)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
            return
        }
        //  email = email.trim();

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }

        const userData = { title: title, name, phone, email, password, address }
        let savedUser = await UserModel.create(userData)
        res.status(201).send({ status: true, message: 'user created successfully', data: savedUser })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })

    }
}

//POST /login
const login = async function (req, res) {
    try {

        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'value in request body is required' })
            return
        }

        let email = req.body.email
        let password = req.body.password

        if (!validator.isValid(email)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
            return
        }
        //  email = email.trim();

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }

        if (!validator.isValid(password)) {
            res.status(400).send({ status: false, message: 'password must be present' })
            return
        }

        if (email && password) {
            let User = await UserModel.findOne({ email: email, password: password })

            if (User) {
                const Token = jwt.sign({
                    userId: User._id,
                    iat: Math.floor(Date.now() / 1000), //issue date
                    exp: Math.floor(Date.now() / 1000) + 30 * 60
                }, "Group8") //exp date 30*60=30min
                res.header('x-api-key', Token)

                res.status(200).send({ status: true, msg: "success", data: User, Token: Token })
            } else {
                res.status(400).send({ status: false, Msg: "Invalid Credentials" })
            }
        } else {
            res.status(400).send({ status: false, msg: "request body must contain  email as well as password" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {registerUser, login}