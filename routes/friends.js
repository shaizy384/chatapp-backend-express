const express = require("express")
const router = express.Router()
const validateToken = require("../middleware/validateToken")
const { fetchFriend } = require("../controller/friendsController")


router.use(validateToken)

router.get("/:userId", fetchFriend)

module.exports = router