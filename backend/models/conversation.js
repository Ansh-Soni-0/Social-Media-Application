const mongoose = require("mongoose")

const conversationSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    message:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]
})

const Conversation = mongoose.post('post' , conversationSchema)

module.exports = Conversation