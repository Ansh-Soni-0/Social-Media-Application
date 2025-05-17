const User = require("../models/user")
const bcrypt = require("bcrypt")
const {createToken} = require("../utils/generateToken")
const {getDataUri} = require("../utils/dataURI")
const cloudinary = require("../config/cloudinary")
const Post = require("../models/post")

const register = async (req,res) => {
    try {
        const {username , email , password} = req.body

        if(!username || !email || !password){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials"
            })
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(401).json({
                success:false,
                message:"User already exist please login"
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10)


        await User.create({
            username,
            email,
            password:hashedPassword
        })

        return res.status(201).json({
            success:true,
            message:"Account Created Successfully"
        })

    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

const login = async (req,res) => {
    try {
        const {email , password} = req.body

        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Something is missing"
            })
        }

        let user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Account Does not exist, please create Account"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password , user.password)
        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials"
            })
        }

        const token = createToken(user._id)

        //populate each post if in the posts 
        const populatedPosts = await Promise.all(

            user.posts.map(async (postid) => {
                const post = await Post.findById(postid)
                if(post.author.equals(user._id)){
                    return post
                }
                return null
            })
            
        )


        user = {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts
        }


        return res.cookie('token' , token , {httpOnly:true , sameSite:'strict' , maxAge:1*24*60*60*1000}).json({
            success:true,
            message:`Welcome back ${user.username}`,
            user
        })

    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

const logout = async (req,res) => {
    try {
        return res.cookie("token","", {maxAge:0}).json({
            success:true,
            message:"Logged out Successfully"
        })
    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

const getProfile = async (req,res) => {
    try {
        const userId = req.params.id
        let user = await User.findById(userId).populate({path:'posts' , createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

const editProfile = async (req,res) => {
    try {
        const userId = req.id

        const {bio , gender} = req.body;

        const profilePicture = req.file

        let cloudResponce;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture)
            cloudResponce = await cloudinary.uploader.upload(fileUri)
        }


        const user = await User.findById(userId).select("-password")

        
        if(!user){
            return res.status(404).json({
                message:"user not found",
                success:false
            })
        }

        if(bio) user.bio = bio
        if(gender) user.gender = gender
        if(profilePicture) user.profilePicture = cloudResponce.secure_url
        
        await user.save();

        return res.status(200).json({
            message:"Profile Updated",
            success:true,
            user
        })

    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

const getSuggestedUser = async (req , res) => {
    try {
        const suggestedUser = await User.find({_id:{$ne:req.id}}).select("-password")
        // ne -> not equal to 
        
        if(suggestedUser.length === 0) {
            return res.status(400).json({
                message:"Currently do not have any use",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            users:suggestedUser
        })
    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

const followOrUnfollow = async (req,res) => {
    try {
        const folloKarneWala = req.id //apni id
        const jiskoFollowKaruga = req.params.id //other user id

        // console.log(folloKarneWala);
        // console.log(jiskoFollowKaruga);
        
        if(folloKarneWala === jiskoFollowKaruga){
            return res.status(400).json({
                message:"Do not follow by youself",
                success:false 
            })
        }

        const user = await User.findById(folloKarneWala);
        const targetUser = await User.findById(jiskoFollowKaruga);

        if(!user || !targetUser){
            return res.status(400).json({
                message:"user not found",
                success:false 
            })
        }

        //now check do follow and unfollow

        const isFollowing = user.following.includes(jiskoFollowKaruga)
        if(isFollowing){ // already follow do unfollow
            await Promise.all([
                User.updateOne({_id:folloKarneWala} , {$pull:{following:jiskoFollowKaruga}}),
                User.updateOne({_id:jiskoFollowKaruga} , {$pull:{followers:folloKarneWala}})
            ])
            return res.status(200).json({
                message:"Unfollowed successfully",
                success:true
            })
        } else { // not follow do follow
            await Promise.all([
                User.updateOne({_id:folloKarneWala} , {$push:{following:jiskoFollowKaruga}}),
                User.updateOne({_id:jiskoFollowKaruga} , {$push:{followers:folloKarneWala}})
            ])
            return res.status(200).json({
                message:"Followed successfully",
                success:true
            })
        }

    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

module.exports = {
    register,
    login,
    logout,
    getProfile,
    editProfile,
    getSuggestedUser,
    followOrUnfollow
}