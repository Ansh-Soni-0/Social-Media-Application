const express = require("express")
const postRouter = express.Router()
const {isAuthenticated} = require("../middlewares/isAuthenticated")
const upload = require("../middlewares/multer")

const {
  addNewPost,
  getAllPost,
  getUserPost,
  likePost,
  dislikePost,
  addComment,
  getCommentsOfPost,
  deletePost,
  bookmarkPost
} = require("../controllers/postController");

postRouter.post("/addpost" , isAuthenticated , upload.single('image') , addNewPost)
postRouter.get("/allpost" , isAuthenticated , getAllPost)
postRouter.get("/userpost/all" , isAuthenticated , getUserPost)
postRouter.get("/:id/like" , isAuthenticated , likePost)
postRouter.get("/:id/dislike" , isAuthenticated , dislikePost)
postRouter.post("/:id/comment" , isAuthenticated , addComment)
postRouter.post("/:id/comment/all" , isAuthenticated , getCommentsOfPost)
postRouter.post("/delete/:id" , isAuthenticated , deletePost)
postRouter.post("/:id/bookmark" , isAuthenticated , bookmarkPost)

module.exports = postRouter