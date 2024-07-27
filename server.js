const express = require("express")
const connectDb = require("./config/dbConnection")
const app = express()
const cors = require("cors")
const cookieSession = require("cookie-session")
const passport = require("passport")
const passportSetup = require("./passport")
require('dotenv').config()

const port = process.env.PORT || 2800
const Frontend_HOST = process.env.Frontend_HOST
connectDb()
app.use(cookieSession({ name: "session", keys: ["galBaat"], maxAge: 24 * 60 * 60 * 100 }))
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/user', require("./routes/socialAuth"))
// app.use('/auth', require("./routes/socialAuth"))
app.use('/api/user', require("./routes/auth"))
app.use('/api/chats', require("./routes/chats"))
app.use('/api/message', require("./routes/message"))
app.use('/api/friends', require("./routes/friends"))
// app.use('/api/google', require("./passport"))

app.get("/", (req, res) => {
    res.send("GalBaat Backend")
})

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
let typers = [];     // stores typing users
io.on("connection", (socket) => {
    console.log("connected to socket.io");
    io.emit("welcome", "hello this is socket io");

    // add user
    socket.on("addUser", userId => {
        //check user id, if not exist add in the array
        console.log("a user connected", userId);
        userId && (!users.some(user => user.userId === userId) && users.push({ userId, socketId: socket.id }))
        // console.log("userId: ", userId, users);
        io.emit("getUsers", users);
    });

    // add typing users
    socket.on("typing", (userId, conversationId) => {
        //check user id, if not exist add in the array
        console.log("a user is typing");
        userId && (!typers.some(typer => typer.userId === userId && typer.conversationId === conversationId) && typers.push({ userId, conversationId, typing: true }))
        console.log("typers: ", userId, conversationId, typers);
        io.emit("getTypers", typers);
    });

    // remove typing user
    socket.on("stop typing", (userId, conversationId) => {
        //check user id, if exists remove from the array
        console.log("user stopped typing");
        typers = typers.filter(typer => typer?.userId !== userId && typer?.conversationId !== conversationId)
        io.emit("getTypers", typers);
    });

    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text, conversationId, unseen_msgs }) => {
        // get specific user from array
        const user = users.find(user => user.userId === receiverId)
        console.log("user?.socketId: ", user, conversationId);
        io.to(user?.socketId).emit("getMessage", {
            senderId, text, conversationId, unseen_msgs
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