// const { validationResult } = require("express-validator")
const Conversation = require("../module/Conversation")
const User = require("../module/userModule")

// Route 1: find user name using get "/api/friends/:userId"
const fetchFriend = async (req, res) => {
    let userId = req.params.userId
    try {
        const data = await User.findById({ _id: userId }, { password: 0, userToken: 0, isVerified: 0 })

        res.json({ data: data, message: "User fetched" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

// Route 2: find friend using email using get "/api/friends/:email"
const findFriend = async (req, res) => {
    let email = req.params.email
    try {
        const data = await User.findOne({ email }, { password: 0, userToken: 0, isVerified: 0 })
        console.log(data, email);
        res.json({ data: data ? data : "", message: "User is found" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

module.exports = { fetchFriend, findFriend }