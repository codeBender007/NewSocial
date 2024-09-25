const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const generateTokenAndSetCookie = require("../utils/helpers/generateTokenAndSetCookie")
const { default: mongoose } = require("mongoose")
const cloudinary = require('cloudinary').v2
const Post = require("../models/postModel")




const signupUser = async (req , res) =>{
    try{

        const { name , email , username , password } = req.body;

        if (!name && !email && !username && !password){
            return res.status(500).json({
                error:"requried all blanks.",
            })
        }

        const user = await User.findOne({$or:[{email},{username}]});

        if(user){
            return res.status(400).json({ error:"user Already exists."});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            name,
            email,
            username,
            password:hashedPassword,
        });
        await newUser.save();

        if(newUser){
            const token=generateTokenAndSetCookie(newUser._id,res);
            res.status(201).json({
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                username:newUser.username,
                bio:newUser.bio,
                profilePic:newUser.profilePic,
            });
        }
        else{
            res.status(400).json({ error:"Invalide user data"});
        }

    }
    catch(err){
        res.status(500).json({ error: err.message});
        console.log("signup err : ",err)
    }
}


const loginUser = async (req,res)=>{
    try{

        const {  username, password } = req.body;

        if ( !username && !password) {
            return res.status(500).json({
                error: "requried all blanks.",
            })
        }

        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password , user?.password || "");

        if (!user || !isPasswordCorrect) return res.status(400).json({ error:"Invalide username or password."});

        const token = generateTokenAndSetCookie(user._id,res);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio:user.bio,
            profilePic:user.profilePic,
        });

    }
    catch (err) {
        res.status(500).json({ error: err.message });
        console.log("login err : ", err)
    }
}


const logoutUser = (req , res) =>{
    try{
        res.cookie("jwt" , "" , {maxAge:1});
        res.status(200).json({message:"User Logged out successfully."});
    }
    catch (err) {
        res.status(500).json({ error: err.message });
        console.log("logout err : ", err)
    }
}


const followUnFollowUser = async (req , res) =>{
    try{
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) return res.status(400).json({ error:"You cannot follow or Unfollow."})

        if (!userToModify || !currentUser) return res.status(400).json({ error:"User not found."});

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({message:"User Unfollowed successfully."})
        }
        else{
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ message: "User followed successfully." })

        }

    }
    catch (err) {
        res.status(500).json({ error: err.message });
        console.log("followUnFollowUser err : ", err)
    }
}


const updateUser = async (req , res) =>{
    const { name , email , username , password , bio } = req.body;

    let { profilePic } = req.body;

    const userId = req.user._id;

    try{
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ error:"User not Found."});

        if(req.params.id !== userId.toString()){
            return res.status(400).json({ error:"You cannot update other user's profile."})
        } 

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password , salt);
            user.password = hashedPassword;
        }
        if(profilePic){
            if(user.profilePic){

                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }

            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadResponse.secure_url;
        }


        user.name = name || user.name;
        user.email = email   || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        await Post.updateMany(
            {"replies.userId":userId},
            {
                $set:{
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic":user.profilePic
                }
            },
            {arrayFilters:[{"reply.userId":userId}]}
        )

        user.password = null;

        res.status(200).json( user );

    }
    catch (err) {
        res.status(500).json({ error: err.message });
        console.log("updateUser err : ", err)
    }
}


const getUserProfile = async (req ,res) =>{
    const { query } = req.params;
    try{
        // const user = await User.findOne({username}).select("-password").select("-updatedAt");
        let user;
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id:query}).select('-password').select("-updatedAt");
        }
        else{
             user = await User.findOne({username:query}).select("-password").select("-updatedAt");
        }

        if(!user){
            return res.status(400).json({
                error:"User not found.",
            })
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
        console.log("getUserProfile err : ", err)
    }
}

module.exports = { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, getUserProfile };