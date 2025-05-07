const express = require("express")
const messageRouter = express.Router()
const {isAuthenticated} = require("../middlewares/isAuthenticated")

const {
    sendMessage,
    getMessage
} = require("../controllers/chatingController")


messageRouter.post('/send/:id' , isAuthenticated , sendMessage)
messageRouter.get('/all/:id' , isAuthenticated , getMessage)

module.exports = messageRouter