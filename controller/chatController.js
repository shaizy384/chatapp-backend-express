// const { validationResult } = require("express-validator")
const Conversation = require("../module/Conversation")

// Route 1: Create Conversation using POST "/api/chats"
const createConversation = async (req, res) => {
    const { senderId } = req.body
    let recieverId = req.user.id

    try {
        let conversion = await Conversation.find({
            members: { $all: [recieverId, senderId] }
        })
        if (conversion.length !== 0) {
            return res.status(400).json({ message: "Conversion already exists" })
        }

        data = await Conversation.create({
            members: [recieverId, senderId]
        })

        res.json({ data, message: "Conversion created" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

// Route 2: find all conversations user using get "/api/chats/"
const fetchConversation = async (req, res) => {
    let recieverId = req.user.id

    try {
        const data = await Conversation.find({
            members: { $in: [recieverId] }
        })

        res.json({ data, message: "Conversion created" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

// Route 3: find conversation if exists using GET "/api/chats/find"
const findConversation = async (req, res) => {
    const { id } = req.body
    let recieverId = req.user.id

    try {
        const data = await Conversation.create({
            members: { $all: [recieverId, id] }
        })

        res.json({ data, message: "Conversion exists" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

module.exports = { createConversation, fetchConversation, findConversation }