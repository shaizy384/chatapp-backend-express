const express = require("express")
const router = express.Router()
const { registerUser, loginUser, fetchUser, verifyEmail, updateUser, forgotPassword, resetLink, resetPassword } = require("../controller/authController")
const { body } = require("express-validator")
const validateToken = require("../middleware/validateToken")
const validateResetToken = require("../middleware/validateResetToken")

router.post('/register', [
    body("name", "Name must contains atleaset 3 characters").isLength({ min: 3 }),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password must contains atleast 8 characters").isLength({ min: 8 })
], registerUser)

router.post('/login', [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password cannot be blanked").exists()
], loginUser)

router.get('/fetchuser', validateToken, fetchUser)
router.post('/updateuser', validateToken, updateUser)

router.get('/verify/:id/:token', verifyEmail)

router.post('/forgot-password', [
    body("email", "Please enter a valid email").isEmail()
], forgotPassword)

router.get('/reset-link/:id/:token', validateResetToken, resetLink)

router.post('/reset-password', [
    body("password", "Password must contains atleaset 8 characters").isLength({ min: 8 })
], validateResetToken, resetPassword)

module.exports = router   