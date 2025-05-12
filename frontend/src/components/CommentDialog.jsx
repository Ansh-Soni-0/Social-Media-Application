import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent ,DialogTitle, DialogTrigger , DialogDescription , DialogHeader } from './ui/dialog'

// import post from '../assets/post.png';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { backend_url } from '@/App';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';

const CommentDialog = ({open , setOpen }) => {

    const {selectedPost , posts} = useSelector(store => store.post)
    const dispatch = useDispatch()
    const [comment , setComment] = useState([])
    const [text , setText] = useState("");


    useEffect(() => {
      if(selectedPost){
        setComment(selectedPost.comments)
      }
    }, [selectedPost])
    

    const changeEventHandler = (e) => {
        const inputText = e.target.value
        if(inputText.trim()){
            setText(inputText)
        }else {
            setText("")
        }
    }

     const sendMessageHandler = async () => {
        try {

            // console.log("hello");
            // console.log(post._id);
            // console.log(text);
            
            const response = await axios.post(
                `${backend_url}/api/post/${selectedPost?._id}/comment` ,
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
                const updatedPostdata = posts.map( p => p._id === selectedPost._id ? {...p, comments : updatedCommentData } : p )

                dispatch(setPosts(updatedPostdata))

                toast.success(response.data.message);

                setText("")
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    

     

  return (
    <>
        <Dialog open={open}>
            <DialogContent
            size="full"
            style={{ width: '50vw', maxWidth: 'none', height: 'auto', maxHeight: 'none' }}
            aria-describedby="comment-dialog-description"
            className="p-0 flex flex-col"
            onInteractOutside={() => setOpen(false)}>

                <DialogTitle className="hidden"/>
                <DialogDescription className="hidden"/>

                <div className='w-[100%] flex flex-1 gap-2'>

                    {/* left image  */}
                    <div className='w-1/2'>
                        <img
                        className='w-full h-full object-cover rounded-l-lg' 
                        src={selectedPost?.image} 
                        alt="post-image" />
                    </div>
                    


                    {/* right comment box */}
                    <div className='w-1/2 flex flex-col justify-between'>

                        <div className='flex items-center justify-between p-4'>

                            <div className='flex gap-3 items-center'>

                                <Link>
                                <Avatar>
                                    <AvatarImage src={selectedPost?.author?.profilePicture} alt="avatar"/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                </Link>

                                <div>
                                    <Link className='font-semibold text-xs'>
                                        {selectedPost?.author?.username}
                                    </Link>

                                    {/* <span className='text-gray-600 text-sm'>
                                        Bio here...
                                    </span> */}
                                </div>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal  className="cursor-pointer"/>
                                </DialogTrigger>

                                <DialogContent  className="flex flex-col p-4">

                                    <div className='cursor-pointer w-full text-[#ED4956] font-bold hover:bg-gray-100 rounded-md p-2 text-center'>Unfollow</div>

                                    <div className='cursor-pointer w-full hover:bg-gray-100  rounded-md p-2 text-center'>Add To Favorite</div>

                                </DialogContent>
                            </Dialog>

                        </div>

                        <hr />

                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                comment.map((comment) => <Comment key={comment._id} comment={comment}/>)
                            }
                        </div>

                        <div className='p-4'>
                            <div className='flex items-center gap-2'>

                                <input
                                value={text}
                                onChange={changeEventHandler} 
                                className='w-full outline-none 
                                border border-gray-300 p-2 rounded'
                                type="text" placeholder='Add a comment...'/>

                                <Button
                                onClick={sendMessageHandler}
                                className="h-full cursor-pointer" 
                                variant={"outline"}
                                disabled={!text.trim()}
                                >Send</Button>
                                
                            </div>
                        </div>

                    </div>
                </div>

                
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CommentDialog