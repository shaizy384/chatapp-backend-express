const express = require("express")
const router = express.Router()
const validateToken = require("../middleware/validateToken")
const { createConversation, fetchConversation, findConversation, updateConversation } = require("../controller/chatController")
// const validateResetToken = require("../middleware/validateResetToken")

router.use(validateToken)

router.post('/update', updateConversation)
router.post('/', createConversation)
router.get('/', fetchConversation)
router.get('/find', findConversation)

module.exports = router