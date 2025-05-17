const {Server} = require("socket.io")
const http = require("http")

const express = require("express")
const app = express()

const server = http.createServer(app)

const io = new Server(server , {
    cors:{
        origin:"http://localhost:5173",
        method:["GET" , "POST"]
    }
})

const userSocketMap = {} //this map store socket id corresponding the user id : userId -> socketid

const getRecieverSocketId = (receiverId) => userSocketMap[receiverId]


io.on("connection" , (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id
        // console.log(`user connected : UserId = ${userId} , socketid = ${ socket.id}`);
    }

    io.emit('getOnlineUsers' , Object.keys(userSocketMap))

    socket.on('disconnect' , () => {
        if(userId){
            // console.log(`user connected : UserId = ${userId} , socketid = ${ socket.id}`);
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers' , Object.keys(userSocketMap))
    })

})

module.exports = {app , server , io , getRecieverSocketId}