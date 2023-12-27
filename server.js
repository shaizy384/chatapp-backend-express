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

// socket io
const io = require("socket.io")(server, {
    cors: {
        origin: Frontend_HOST
    }
})

io.on("connection", (server)=>{
    console.log("connected to socket.io");
    io.emit("welcome", "hello this is socket io")
})