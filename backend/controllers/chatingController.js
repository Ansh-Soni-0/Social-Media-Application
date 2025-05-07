const Conversation = require("../models/conversation")
const Message = require("../models/message")

const sendMessage = async (req , res) => {
    try {

        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId , receiverId]}
        })

        // establish the conversation if not started yet 
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId]
            })
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
        // await conversation.save()
        // await newMessage.save()

        await Promise.all([conversation.save() , newMessage.save()])

        // implement socketio for real time data transfer soon




        return res.status(202).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

const getMessage = async (req , res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId , receiverId]}
        })

        if(!conversation){
            return res.status(200).json({
                success:true,
                messages:[]
            })
        }

        return res.status(200).json({
            success:true,
            message:conversation?.messages
        })

        
    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

module.exports = {
    sendMessage,
    getMessage
}