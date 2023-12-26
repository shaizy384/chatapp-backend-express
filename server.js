const express = require("express")
const connectDb = require("./config/dbConnection")
const app = express()
const cors = require("cors")
require('dotenv').config()

const port = process.env.PORT || 2800

connectDb()
app.use(express.json())
app.use(cors())

app.use('/api/user', require("./routes/auth"))
app.use('/api/chats', require("./routes/chats"))
app.use('/api/message', require("./routes/message"))
app.use('/api/friends', require("./routes/friends"))

app.listen(port, ()=> {
    console.log(`This app is listening on port ${port}`);
})