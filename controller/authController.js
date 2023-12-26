const { validationResult } = require("express-validator");
const User = require('../module/userModule')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
// const UserVerify = require("../module/userVerification");
const sendEmail = require("../utils/Email");

// env variables
const backHost = process.env.Backend_HOST
const frontHost = process.env.Frontend_HOST
const jwtSec = process.env.JWT_SECRET
const secretToken = process.env.SECRET_TOKEN
// const resetKey = process.env.RESET_TOKEN

// Route 1: register user using POST "/api/user/register"
const registerUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: "Invalid input fields" })
    }

    const { name, email, password, isVerfied } = req.body
    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email })
        if (user) { return res.status(400).json({ message: "The user already exits" }) }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        user = await User.create({
            name, email, password: hashPassword, isVerfied, userToken: ""
        })
        const emailToken = jwt.sign({ id: user._id }, secretToken, { expiresIn: "1m" })

        const userToken = { "userToken": emailToken }
        user = await User.findByIdAndUpdate(user.id, userToken, { new: true })

        // Send Email
        const link = `${backHost}/api/user/verify/${user._id}/${user.userToken}`
        const subject = `Verify Your GalBaat Email Address`
        const message = `<p>Thanks for signing up with GalBaat! Click on the link below to verify your email:</p>
    
        <a href="${link}">Click here</a>
        
        <p>This link will expire in 24 hours. If you did not sign up for a Render account,
        you can safely ignore this email. Have fun, and don't hesitate to contact us with your feedback.</p>
        
        <p>Best,<br>The ChatApp Team</p>`

        await sendEmail(user.email, subject, message)

        res.json({ data: user.name, message: "A verification link is sent to your account, please verify to activate your account" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

// Route 2: verify user using POST "/api/user/verify/:id/:token"
const verifyEmail = async (req, res) => {
    try {
        const { id, token } = req.params
        let user = await User.findById(id)
        if (!user) { return res.status(400).json({ message: "Invalid Link" }) }

        let verifyToken = await User.findOne({ userToken: token })
        if (!verifyToken) { return res.status(400).json({ message: "Invalid Link" }) }

        const verified = { "isVerfied": "true" }
        await User.findByIdAndUpdate(id, verified, { new: true })

        res.redirect(`${frontHost}/login`)
        res.json({ message: "Account verified successfully" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

// Route 3: login user using POST "/api/user/login"
const loginUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array(), message: "Invalid input fields" }) }

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) { return res.status(400).json({ message: "Invalid credentials" }) }

        let checkPass = await bcrypt.compare(password, user.password)
        if (!checkPass) { return res.status(400).json({ message: "Invalid credentials" }) }
        // if (!user.isVerfied) { res.redirect(`${frontHost}/verifyemail`); }

        const data = {
            user: {
                id: user._id
            }
        }
        let authToken = jwt.sign(data, jwtSec)

        res.json({ auth: authToken, message: "Logged in successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

// Route 4: fetch user using Get "/api/user/fetchuser/"
const fetchUser = async (req, res) => {
    try {
        userId = req.user.id
        let user = await User.findById(userId).select("-password")

        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

// Route 5: Forgot password using POST "/api/user/forgot-password"
const forgotPassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array(), message: "Invalid input fields" }) }

    try {
        const { email } = req.body
        let user = await User.findOne({ email })
        if (!user) { return res.status(400).json({ message: "Invalid credentials" }) }

        const data = {
            user: {
                id: user._id
            }
        }
        const secret = resetKey + user.password

        const resetString = await jwt.sign(data, secret)

        // send email
        const link = `${backHost}/api/user/reset-link/${user._id}/${resetString}`
        const subject = 'Password Reset Link'
        const message = `<p>Thanks for signing up with ShaizMart! Click on the link below to verify your email:</p>
        <a href="${link}">Click here</a>
        <p>This link will expire in 24 hours. If you did not sign up for a Render account,
        you can safely ignore this email. Have fun, and don't hesitate to contact us with your feedback.</p>
        <p>Best,<br>The ShaizMart Team</p>`

        await sendEmail(user.email, subject, message)

        res.json({ user, message: "Password reset link has been sent to your email" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

// Route 6: Reset password using GET "/api/user/reset-link/:id/:token"
const resetLink = async (req, res) => {
    // const { id, token } = req.params
    const { token } = req.params
    userId = req.user.id

    try {
        // let user = await User.findById(id)
        // if (!user) { return res.status(400).json({ message: "Invalid Reset Link" }) }

        // const secret = resetKey + user.password

        // jwt.verify(token, secret, (err, decode) => {
        //     if (err) {
        //         return res.status(400).send("Link Expired!")
        //     }
        // })

        res.redirect(`${frontHost}/reset-password/${userId}/${token}`)
        // res.json({ message: "Password reset link verified successfully" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}


// Route 7: Update Reset password in db using POST "/api/user/reset-password"
const resetPassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array(), message: "Invalid input fields" }) }

    // const { id, password, token } = req.body
    const { password } = req.body
    userId = req.user.id

    try {
        // let user = await User.findById(id)
        // if (!user) { return res.status(400).json({ message: "Invalid Reset Link" }) }

        // const secret = resetKey + user.password
        // jwt.verify(token, secret, (err, decode) => {
        //     if (err) {
        //         return res.status(400).send("Link Expired!")
        //     }
        // })
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newPass = { password: hashPassword }
        await User.findByIdAndUpdate(userId, newPass, { new: true })

        res.json({ message: "Password updated successfully" })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}


module.exports = { registerUser, loginUser, fetchUser, verifyEmail, forgotPassword, resetLink, resetPassword }