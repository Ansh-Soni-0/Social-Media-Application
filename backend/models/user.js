const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:"/images/default.jpg"
    },
    bio:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        enum:['male','female','other']
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    bookmarks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }]
} , {timestamps:true})

const User = mongoose.model("user" , userSchema)

module.exports = User