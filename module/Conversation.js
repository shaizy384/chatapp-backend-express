const mongoose = require("mongoose")
const { Schema } = mongoose

const ConversationSchema = new Schema(
    {
        members: {
            type: Array,
            required: true,
        },
        last_message: {
            type: String,
        },
        unseen_msgs: {
            type: Number,
            default: 0
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Conversation", ConversationSchema)