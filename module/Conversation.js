const mongoose = require("mongoose")
const { Schema } = mongoose

const ConversationSchema = new Schema(
    {
        members: {
            type: Array,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Conversation", ConversationSchema)