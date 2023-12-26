const User = require('../module/userModule')
const jwt = require('jsonwebtoken')
const resetKey = process.env.RESET_TOKEN

const validateResetToken = async (req, res, next) => {
    const { id, token } = (Object.keys(req.body).length !== 0) ? req.body : req.params
    console.log("hello ", req.body, req.params);

    try {
        let user = await User.findById(id)
        if (!user) { return res.status(400).json({ message: "User not found", id: id, token }) }

        const secret = resetKey + user.password

        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                return res.status(400).send("Link Expired!")
            }
            req.user = decoded.user
            next()
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

module.exports = validateResetToken