const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Post"
    }
})

const Comment = mongoose.model("Comment" , commentSchema)

module.exports = Comment