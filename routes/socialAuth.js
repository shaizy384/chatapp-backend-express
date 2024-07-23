const express = require("express")
const router = express.Router()
const passport = require("passport")
const jwt = require("jsonwebtoken");
const { registerUser, loginUser, fetchUser, verifyEmail, forgotPassword, resetLink, resetPassword } = require("../controller/authController")
const { body } = require("express-validator")
const validateToken = require("../middleware/validateToken");
const User = require("../module/userModule");
// const validateResetToken = require("../middleware/validateResetToken")
const Frontend_HOST = process.env.Frontend_HOST
const jwtSec = process.env.JWT_SECRET

router.get('/login/failed', (req, res) => {
    return res.status(400).json({ message: "Login Failed" })
})
router.get("/login/success", async (req, res) => {
    if (req.user) {
        const user = await User.findOne({ accountId: req.user }).select("_id")
        console.log("login id: ", req.user, user?._id);
        // const data = {
        //     user: {
        //         id: id._id
        //     }
        // }
        // let authToken = jwt.sign(data, jwtSec)
        return res.json({ user, message: "Logged in successfully" });
        // return res.json({ auth: authToken, message: "Logged in successfully" });
        // return res.status(200).json({
        //     message: "successfull",
        //     user: req.user,
        //     //   cookies: req.cookies
        // });
    }
    else {
        return res.status(400).json({ message: "Social Invalid credentials" })
    }
});
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect(Frontend_HOST)
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: Frontend_HOST,
    failureRedirect: '/login/failed',
}))

// Express route to handle the error response
// router.get('/google/callback', (req, res, next) => {
//     passport.authenticate('google', (err, user) => {
//         if (err) {
//             // Handle error response
//             return res.status(400).json({ message: err.message });
//         }
//         if (!user) {
//             return res.redirect('/login');
//         }
//         req.logIn(user, (err) => {
//             if (err) {
//                 return res.status(400).json({ message: err.message });
//             }
//             return res.redirect('/'); // Redirect to your desired page
//         });
//     })(req, res, next);
// });

router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }))
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login/failed',
}))

module.exports = router   