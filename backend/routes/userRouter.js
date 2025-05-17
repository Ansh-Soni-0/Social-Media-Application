const express = require("express")
const userRouter = express.Router()
const {isAuthenticated} = require("../middlewares/isAuthenticated")
const upload = require("../middlewares/multer")

const  {
    register,
    login,
    logout,
    getProfile,
    editProfile,
    getSuggestedUser,
    followOrUnfollow
} = require("../controllers/userController")


userRouter.post("/register" , register)
userRouter.post("/login" , login)
userRouter.get("/logout" , logout)
userRouter.get("/:id/profile" ,isAuthenticated , getProfile)
userRouter.post("/profile/edit" ,isAuthenticated, upload.single("profilePhoto") , editProfile)
userRouter.get("/suggested" , isAuthenticated , getSuggestedUser)
userRouter.get("/followorunfollow/:id" , isAuthenticated , followOrUnfollow)

module.exports = userRouter