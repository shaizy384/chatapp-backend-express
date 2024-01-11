const express = require("express")
const router = express.Router()
const validateToken = require("../middleware/validateToken")
const { fetchFriend, findFriend } = require("../controller/friendsController")


router.use(validateToken)

router.get("/:userId", fetchFriend)
router.get("/findUser/:email", findFriend)

module.exports = router