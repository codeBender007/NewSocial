const express = require("express");
const protectRoute = require("../middlewares/protectRoute.js");
const { sendMessage, getMessage, getConversations, faltu } = require("../controllers/messageController.js");

const router = express.Router()

router.post('/', protectRoute, sendMessage)
router.get('/conversations', protectRoute, getConversations)
router.get('/:otherUserId', protectRoute, getMessage)

module.exports = router;