// const { validationResult } = require("express-validator")
const Conversation = require("../module/Conversation");
const Message = require("../module/Message");

// Route 1: Create Message using POST "/api/message"
const createMessage = async (req, res) => {
    // const { conversationId, senderId, text } = req.body
    // let recieverId = req.user.id

    try {
        data = await Message.create(req.body)

        res.json({ data, message: "Message created" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

// Route 2: find conversation messages using GET "/api/message/:conversationId"
const fetchMessage = async (req, res) => {
    // const { conversationId } = req.body
    // let recieverId = req.user.id

    try {
        const data = await Message.find({ conversationId: req.params.conversationId })

        res.json({ data, message: "messages fetched" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

module.exports = { createMessage, fetchMessage }