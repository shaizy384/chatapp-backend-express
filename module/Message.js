const mongoose = require("mongoose")
const { Schema } = mongoose

const MessageSchema = new Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        text: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Messages", MessageSchema)