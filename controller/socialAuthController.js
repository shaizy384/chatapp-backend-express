const { validationResult } = require("express-validator");
const User = require("../module/userModule");
const jwt = require("jsonwebtoken");
const jwtSec = process.env.JWT_SECRET

const socialLogin = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array(), message: "Invalid input fields" }) }

    try {
        // if (req.user) {
        if (req.body.email) {
            let user = await User.findOne({ email: req.body.email })
            if (user && (user.provider !== req.body.provider)) {
                return res.status(400).json({ message: `User is registered with email and password` });
            }
        }

        let user = await User.findOne({ accountId: req.body.accountId })
        console.log("login id: ", req.user, user);

        if (!user) {
            user = new User(req.body)
            await user.save()
        }

        const data = {
            user: {
                id: user._id
            }
        }
        let auth = jwt.sign(data, jwtSec)
        return res.json({ auth, user, message: "Logged in successfully" });
        // return res.json({ auth: authToken, message: "Logged in successfully" });
        // return res.status(200).json({
        //     message: "successfull",
        //     user: req.user,
        //     //   cookies: req.cookies
        // });
        // }
        // else {
        //     return res.status(400).json({ message: "Social Invalid credentials" })
        // }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { socialLogin }