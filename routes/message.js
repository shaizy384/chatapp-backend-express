const express = require("express")
const router = express.Router()
const validateToken = require("../middleware/validateToken")
const { createMessage, fetchMessage } = require("../controller/messageController")

router.use(validateToken)

router.post('/', createMessage)

router.get('/:conversationId', fetchMessage)

module.exports = router