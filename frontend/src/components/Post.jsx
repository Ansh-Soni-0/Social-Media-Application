import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import React, { lazy, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { FaHeart , FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
// import { backend_url } from '@/App'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { backend_url } from '@/App'
import { DialogTitle } from '@radix-ui/react-dialog'
import default2 from '../assets/default2.webp'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'

const Post = ({ post }) => {
    const [open , setOpen] = useState(false)

    const [text , setText] = useState("")

    const {user} = useSelector(store => store.auth)

    const {posts} = useSelector(store => store.post)

    // const {selectedPost} = useSelector(store => store.post)


    // post.likes.includes(user?._id) -> check that user is liked or not

    const [liked , setLiked] = useState(post.likes.includes(user?._id) || false )

    const [postLike , setPostLike] = useState(post.likes.length)

    const [comment , setComment] = useState(post.comments)

    const dispatch = useDispatch()

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText)
        } else {
            setText("")
        }
    }

    const likeOrDislikeHandler = async () => {
        try {

            const action = liked ? "dislike" : "like";
            const response = await axios.get(backend_url + `/api/post/${post._id}/${action}` , {withCredentials:true})


            if(response.data.success){
                const UpdatedLikes = liked ? postLike - 1 : postLike + 1;  

                setPostLike(UpdatedLikes)

                setLiked(!liked)

                //do update post
                const updatedPostdata = posts.map(p => 
                    p._id === post._id ? {
                        ...p,
                        likes : liked ? p.likes.filter(id => id !== user._id) : [...p.likes , user._id]
                    } : p
                )

                // console.log(updatedPostdata);
                
                dispatch(setPosts(updatedPostdata))

                toast.success(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const commentHandler = async () => {
        try {

            // console.log("hello");
            // console.log(post._id);
            // console.log(text);
            
            const response = await axios.post(
                `${backend_url}/api/post/${post._id}/comment` ,
                 {text} ,
                {
                    headers:{
                        'Content-Type':'application/json',
                    },
                    withCredentials:true
                }
            )

            // console.log(response.data);
            

            if(response.data.success){
                
                const updatedCommentData = [...comment , response.data.comment];

                setComment(updatedCommentData)

                // updated post data after add comments 
                const updatedPostdata = posts.map( p => p._id === post._id ? {...p, comments : updatedCommentData } : p )
                dispatch(setPosts(updatedPostdata))

                toast.success(response.data.message);

                setText("")
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    
    const deletePostHandler = async () => {
        try {
            const response = await axios.delete(backend_url + `/api/post/delete/${post?._id}` , {withCredentials:true})

            if(response.data.success){

                //update post data in the redux to get all post after remove a post
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id)
                dispatch(setPosts(updatedPostData))

                toast.success(response.data.message)

            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // useEffect(() => {
      
    //  console.log(post?.author?.username);
     
    // }, [])
    

  return (

    // post container 
    <div className='my-8 w-full max-w-sm mx-auto'>


        {/* post profile username three dot  */}
        <div className='flex items-center justify-between'>

            <div className='flex items-center gap-2'>

                <Link>
                    <Avatar>
                    <AvatarImage
                     src={post.author?.profilePicture || default2} 
                     alt="avatar"/>
                    <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Link>

                <div className='flex gap-3 items-center'>
                    <h1>{post?.author?.username || "Unknown"}</h1>

                    {
                        (user?._id === post?.author?._id) &&
                        <Badge
                        variant={"secondary"}
                        >Author</Badge> 
                    }

                    

                </div>


            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <MoreHorizontal className='cursor-pointer'/>
                </DialogTrigger>

                <DialogContent className="flex flex-col items-center text-sm text-center">

                    <DialogTitle />
                    <DialogDescription/>

                    <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">
                        unfollow
                    </Button>
                    <Button variant='ghost' className="cursor-pointer w-fit ">
                        Add To Favorites
                    </Button>

                    {
                        user && post?.author?._id && (user._id === post.author._id)  &&
                        <Button 
                        onClick={deletePostHandler}
                        variant='ghost' className="cursor-pointer w-fit">
                        Delete
                        </Button>
                    }

        
                </DialogContent>
            </Dialog>

        </div>


        {/* post image  */}
        <img 
        className='rounded-md my-2 w-full aspect-square object-cover'
        src={post.image} 
        alt="post-image" 
        />

        {/* post like share comment bookmark */}
        <div className='flex justify-between transition-all'>

            <div className='flex gap-3'>

                {
                    liked ?

                        (<FaHeart 

                        onClick={likeOrDislikeHandler}
                        
                        size={'24px'}
                        className='text-red-500 cursor-pointer'
                        />)
                        
                    :   (<FaRegHeart 

                        onClick={likeOrDislikeHandler}

                        size={'24px'} className='cursor-pointer hover:opacity-[0.4] duration-200'/>)
                }

                

                <MessageCircle 

                    onClick={
                        () => {
                            dispatch(setSelectedPost(post))   , setOpen(true)}
                    }

                className='cursor-pointer hover:hover:opacity-[0.4] duration-200'/>
                <Send className='cursor-pointer hover:opacity-[0.4] mt-0.5 duration-200'/>

            </div>

            <Bookmark className='cursor-pointer hover:opacity-[0.4] duration-200'/>

        </div>


        <span className='font-medium blok mb-2'>{postLike} likes</span>

        <p className='mt-1'>
            <span className='font-medium mr-2'>
                {post.author?.username}
            </span>
            {post.caption}
        </p>

        {
            comment.length > 0 &&
            (<span
                className='cursor-pointer text-sm font-semibold text-gray-400'
                onClick={
                    () => {
                    dispatch(setSelectedPost(post)), 
                    setOpen(true)}
                }
                >
                view all {comment.length} Comments
            </span>)
        }

        

        {/* creating comment section onclicking  */}
        <CommentDialog 
        open={open} 
        setOpen={setOpen}/>

        {/* comment input  */}
        <div className='w-full flex justify-between mt-0.5'>
            <input
            value={text}
            onChange={changeEventHandler}
            className='outline-none text-sm w-full  font-semibold'
            placeholder='Add a comment...'
            type="text" />


            {
                text && <span 
                onClick={commentHandler}
                className='text-[#3badf8] cursor-pointer font-semibold'>Post</span>
            }
        </div>


    <hr className='w-full mt-6'/>
    </div>

    
  )
}

export default Post