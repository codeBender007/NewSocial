const express = require("express");
const protectRoute = require("../middlewares/protectRoute")
const router = express.Router();
const postControllers = require("../controllers/postController")


router.get("/feed", protectRoute , postControllers.getFeedPosts)
router.get("/:id", postControllers.getPost)
router.get("/user/:username", postControllers.getUserPosts)
router.post('/create', protectRoute ,postControllers.createPost);
router.delete("/:id", protectRoute, postControllers.deletePost)
router.put("/like/:id", protectRoute, postControllers.likeUnlikePost)
router.put("/reply/:id", protectRoute , postControllers.replyToPost)


module.exports = router;