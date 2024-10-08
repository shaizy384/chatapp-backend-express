// const { validationResult } = require("express-validator")
const Conversation = require("../module/Conversation");
const User = require("../module/userModule");

// Route 1: Create Conversation using POST "/api/chats"
const createConversation = async (req, res) => {
    const { senderId } = req.body
    let recieverId = req.user.id
    console.log({ recieverId, senderId, bodysenderId: req.body });

    try {
        let conversation;
        if (recieverId === senderId) {
            conversation = await Conversation.find({
                members: [recieverId, senderId]
            })
        } else {
            conversation = await Conversation.find({
                members: { $all: [recieverId, senderId] }
            })
        }
        console.log("already existed conv: ", conversation);
        if (conversation.length !== 0) {
            return res.status(400).json({ message: "Conversation already exists" })
        }

        data = await Conversation.create({
            members: [recieverId, senderId]
        })

        res.json({ data, message: "Conversation created" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

// Route 2: Update Conversation using POST "/api/chats"
const updateConversation = async (req, res) => {
    let userId = req.user.id
    console.log("body: ", req.body);

    try {
        let conversation = await Conversation.findById(req.body._id)

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" })
        }

        conversation = await Conversation.findByIdAndUpdate(req.body._id, req.body, { new: true })

        const friend_id = conversation.members.filter(c => c !== userId)[0]
        const friendData = await User.findById(friend_id);

        const data = { ...conversation?._doc, friend_id, friendData }

        res.json({ data, message: "Conversation updated" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

// Route 3: find all conversations user using get "/api/chats/"
const fetchConversation = async (req, res) => {
    let recieverId = req.user.id

    try {
        // const data = await Conversation.find({
        //     members: { $in: [recieverId] }
        // })


        const data = await Conversation.aggregate([
            {
                $match: {
                    members: { $in: [recieverId] }
                }
            },
            {
                $addFields: {
                    friend_id: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$members",
                                    as: "member",
                                    cond: { $ne: ["$$member", recieverId] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $addFields: {
                    friend_id: { $toObjectId: "$friend_id" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "friend_id",
                    foreignField: "_id",
                    as: "friendData",
                    pipeline: [
                        {
                            $project: {
                                email: 1,
                                name: 1,
                                photoURL: 1
                            }
                        }
                    ]
                },
            },
            {
                $addFields: {
                    friendData: {
                        $first: "$friendData"
                    }
                }
            }
        ])

        // console.log("newData: ", recieverId, newData);

        res.json({ data, message: "Conversion fetched" })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
}

// Route 4: find conversation if exists using GET "/api/chats/find"
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

module.exports = { createConversation, fetchConversation, findConversation, updateConversation }