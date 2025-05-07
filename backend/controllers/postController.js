const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");
const Post = require("../models/post")
const User = require("../models/user")
const Comment = require("../models/comment")

const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "Image required",
        success: false,
      });
    }

    //image upload
    const optimizedImageBuffer = await sharp(image.buffer)
    .resize({width: 800,height: 800,fit: "inside",})
    .toFormat('jpeg' , {quality:80})
    .toBuffer();

    //buffer data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

    //send to cloudinary
    const cloudResponce = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
        caption,
        image:cloudResponce.secure_url,
        author:authorId
    })

    const user = await User.findById(authorId)
    if(user){
        user.posts.push(post._id)
        await user.save()
    }

    await post.populate({path:'author' , select:'-password'});

    return res.status(201).json({
        message:'New post added', 
        post,
        success:true
    })

  } catch (error) {
    console.log(error);
    res.json({success : false , message:error.message})
  }
};

const getAllPost = async (req , res) => {
    try {
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path:'author' , select:"username,profilePicture"})
        .populate({
            path:"comments",
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:"username , profilePicture"
            }
        })

        console.log(posts);
        

        return res.status(200).json({
            posts,
            success:true,
        })
    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
};

const getUserPost = async (req, res) => {
    try {
        const authorId = req.id
        const posts = await Post.find({author:authorId}).sort({createdAt:-1})
        .populate({
            path:"author",
            select:"username , profilePicture"
        })
        .populate({
            path:"comments",
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:"username , profilePicture"
            }
        });

        return res.status(200).json({
            posts,
            success:true,
        })
    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
};

const likePost = async (req , res) => {
    try {
        const likeKarneWaleUserkiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:"Post not found",
                success:false
            })
        }

        //like logic for one user can like only onec
        await post.updateOne({$addToSet : {likes:likeKarneWaleUserkiId}});

        await post.save()

        // implement socket io for real time notification

        return res.status(200).json({
            message:"Post liked",
            success:true
        })

    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
};

const dislikePost = async (req , res) => {
    try {
        const likeKarneWaleUserkiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:"Post not found",
                success:false
            })
        }

        //like logic for one user can like only onec
        await post.updateOne({$pull : {likes:likeKarneWaleUserkiId}});
        await post.save()

        // implement socket io for real time notification

        return res.status(200).json({
            message:"Post disliked",
            success:true
        })

    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
};

const addComment = async (req , res) => {
    try {
        const postId = req.params.id;
        const commentKarneWaleUserKiId = req.id;

        //get comment text from body
        const {text} = req.body;

        const post = await Post.findById(postId)

        if(!text){
            res.status(400).json({
                message:"Text required",
                success:false
            })
        }

        const comment = await Comment.create({
            text,
            author:commentKarneWaleUserKiId,
            post:postId
        })

        await comment.populate({
            path:'author',
            select:"username , profilePicture"
        })

        post.comments.push(comment._id)

        await post.save();

        return res.status(200).json({
            message:"Comment Added",
            comment,
            success:true
        })

    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
};

const getCommentsOfPost = async (req,res) => {
    try {
        const postId = req.params.id

        const comments = await Comment.find({post:postId})
        .populate('author' , 'username , profilePicture')

        if(!comments) {
            return res.status(404).json({
                message:"No comments found for this post",
                success:false
            })
        }

        return res.status(200).json({success:true , comments})


    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const authorId = req.id;

        const post = await Post.findById(postId);

        if(post){
            return res.status(404).json({
                message:"post not found",
                success:false
            })
        }

        // check if the logged-in user is the owner of not
        if(postId.author.toString() !== authorId){
            return res.status(403).json({
                message:"Unauthorized"
            })
        }

        // delete post 
        await Post.findByIdAndDelete(postId)

        // remove the post id from the user post
        let user = await User.findById(authorId)
        user.posts = user.posts.filter(id => id.toString() !== postId)

        await user.save();

        //delete associated comments
        await Comment.deleteMany({post:postId})

        return res.status(200).json({
            message:"Post Deleted",
            success:true
        })

    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
};

const bookmarkPost = async (req , res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id

        const post  = await Post.findById(postId)

        if(!post){
            return res.status(404).json({
                message:"post not found",
                success:false
            })
        }

        const user = await User.findById(authorId)

        if(user.bookmarks.includes(post._id)){//already bookmark -> remove from the bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save()

            return res.status(200).json({
                type:'unsaved',
                message:"Post removed from bookmark",
                success:true
            })
        } else { // not bookmark -> do bookmarked
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save()

            return res.status(200).json({
                type:'Saved',
                message:"Post bookmarked",
                success:true
            })
        }
    } catch (error) {
        console.log(error);
        res.json({success : false , message:error.message})
    }
}

module.exports = {
  addNewPost,
  getAllPost,
  getUserPost,
  likePost,
  dislikePost,
  addComment,
  getCommentsOfPost,
  deletePost,
  bookmarkPost
};
