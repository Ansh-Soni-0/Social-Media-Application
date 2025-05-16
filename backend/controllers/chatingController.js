const Conversation = require("../models/conversation")
const Message = require("../models/message")
const {io} = require("../socket/socket")

const {getRecieverSocketId} = require("../socket/socket")

const sendMessage = async (req , res) => {
    try {

        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage:message } = req.body;
        console.log(message);
        

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
        const reciverSocketId = getRecieverSocketId(receiverId)
        if(reciverSocketId) {
            io.to(reciverSocketId).emit('newMessage' , newMessage)
        }
        return res.status(201).json({
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
        }).populate('messages');

        if(!conversation){
            return res.status(200).json({
                success:true,
                messages:[]
            })
        }

        return res.status(200).json({
            success:true,
            messages:conversation?.messages
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