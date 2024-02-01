const jwt = require("jsonwebtoken")

const validateToken = (req, res, next) => {

    const jwtSec = process.env.JWT_SECRET
    const authToken = req.header("x-auth-token")
    console.log("auth gmail user: ", req.user);
    if (!authToken) { return res.status(400).send("Please authenticate using a valid token") }

    try {
        jwt.verify(authToken, jwtSec, (error, decoded) => {
            if (error) {
                return res.status(400).send("User is not authorized")
            }
            req.user = decoded.user
            next()
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

module.exports = validateToken