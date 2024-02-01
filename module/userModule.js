const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        //accountId can be google Id, facebook Id
        accountId: {
            type: String,
        },
        photoURL: {
            type: String,
        },
        provider: {
            type: String,
            default: "custom"
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            // required: true
        },
        userToken: {
            type: String,
            default: ""
        },
        isVerified: {
            type: Boolean,
            default: "false"
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)
module.exports = User