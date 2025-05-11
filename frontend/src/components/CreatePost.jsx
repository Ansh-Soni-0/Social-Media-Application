import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle , DialogDescription } from './ui/dialog'
import { AvatarFallback ,Avatar , AvatarImage  } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { backend_url } from '@/App'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'


const CreatePost = ({open , setOpen}) => {

    const [file , setFile] = useState("");
    const [caption , setCaption] = useState("");
    const [imagePreview , setImagePreview] = useState("");
    const [loading , setLoading] = useState(false);
    
    const {user} = useSelector(store => store.auth)
    const {posts} = useSelector(store => store.post)
    const dispatch = useDispatch()

    const imageRef = useRef();


    const createPostHandler = async (e) => {

        const formData = new FormData()
        formData.append("caption" , caption)
        if(imagePreview) formData.append("image", file)
        
        try {
            setLoading(true)
            const response = await axios.post(backend_url + "/api/post/addpost" , formData , {
                TitleDialogTitles:{
                    'Content-Type' : "multipart/form-data"
                },
                withCredentials:true
            })

            if(response.data.success){

                // console.log(response.data);

                dispatch(setPosts([response.data.post , ...posts]));
                // console.log(response.data.post);
                
                toast.success(response.data.message)

                setOpen(false)
            }

        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0]
        if(file){
            setFile(file)

            const dataURL = await readFileAsDataURL(file);

            setImagePreview(dataURL)
        }
    }
  return (
    <div>
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
            <DialogHeader>

                <DialogDescription/>
                
                <DialogTitle className="text-center font-semibold">
                    Create New Post
                </DialogTitle>

                <div 
                className='flex gap-3 items-center'>

                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="post-image"/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div>
                        <h1 className='font-semibold text-sm'>
                            {user?.username}
                        </h1>
                        <span className='text-gray-600 text-xs'>{user?.bio}</span>
                    </div>
                </div>

                <Textarea 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="focus-visible:ring-transparent border border-none" placeholder="Write a caption..." />

                {
                    imagePreview && 
                    (<div className='w-full h-64 flex items-center justify-center'>
                        <img 
                        className='w-[240px] object-cover rounded-md'
                        src={imagePreview} alt="preview-image" />
                    </div>)
                }

                <input 
                onChange={fileChangeHandler}
                ref={imageRef}
                type="file" 
                className='hidden' />     

                <Button 
                onClick={() => imageRef.current.click()}
                className="cursor-pointer w-fit mx-auto bg-[#0095f6] hover:bg-[rgb(41,126,223)]">Select from computer</Button>

                {
                    imagePreview && 
                    (
                        loading ? 
                        (
                            <Button>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                Please wait...
                            </Button>
                        )  :
                        (
                            <Button
                            onClick={createPostHandler}
                            type="submit"
                            className="cursor-pointer"
                            >Post</Button>
                        )
                    )
                }
            </DialogHeader>    
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default CreatePost