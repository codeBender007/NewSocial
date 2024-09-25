const express = require("express");
const protectRoute = require("../middlewares/protectRoute")
const userController = require("../controllers/userController")


const router = express.Router();

router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

router.post("/follow/:id", protectRoute, userController.followUnFollowUser);
router.put("/update/:id", protectRoute ,  userController.updateUser);

router.get("/profile/:query",  userController.getUserProfile);



module.exports = router;