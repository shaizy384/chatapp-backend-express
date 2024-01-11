const express = require("express")
const connectDb = require("./config/dbConnection")
const app = express()
const cors = require("cors")
require('dotenv').config()

const port = process.env.PORT || 2800
const Frontend_HOST = process.env.Frontend_HOST
connectDb()
app.use(express.json())
app.use(cors())

app.use('/api/user', require("./routes/auth"))
app.use('/api/chats', require("./routes/chats"))
app.use('/api/message', require("./routes/message"))
app.use('/api/friends', require("./routes/friends"))

const server = app.listen(port, () => {
    console.log(`This app is listening on port ${port}`);
})

// starting socket io
const io = require("socket.io")(server, {
    cors: {
        origin: Frontend_HOST
    }
})

let users = [];     // stores online users
io.on("connection", (socket) => {
    console.log("connected to socket.io");
    io.emit("welcome", "hello this is socket io");

    // add user
    socket.on("addUser", userId => {
        //check user id, if not exist add in the array
        console.log("a user connected");
        userId && (!users.some(user => user.userId === userId) && users.push({ userId, socketId: socket.id }))
        // console.log("userId: ", userId, users);
        io.emit("getUsers", users);
    });

    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        // get specific user from array
        const user = users.find(user => user.userId === receiverId)
        console.log("user?.socketId: ", user);
        io.to(user?.socketId).emit("getMessage", {
            senderId, text,
        })
        // console.log("userId: ", users);
        // io.emit("getUsers", users)
    });

    // disconnect user
    socket.on("disconnect", () => {
        console.log("a user disconnected");
        users = users.filter(user => user?.socketId !== socket.id)
        io.emit("getUsers", users)
    });
})