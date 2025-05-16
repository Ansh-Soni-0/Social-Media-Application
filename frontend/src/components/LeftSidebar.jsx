import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import logo from '../assets/logo.png';
import {
  Home,
  LogOut,
  MessageCircle,
  Heart,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { backend_url } from "@/App";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {

    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const [open , setOpen] = useState(false)
    const { likeNotification } = useSelector(store => store.realTimeNotification) || []
    

    
    // console.log(likeNotification[0].userDetails.username);
    // console.log(likeNotification.length);
    // console.log(likeNotification[0]);
    
    
    


    const logoutHandler = async () => {
        try {
            const response = await axios.get(backend_url + "/api/user/logout" ,{withCredentials:true});

            if(response.data.success){
              
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))

                navigate("/login")
                toast.success(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    

    const sidebarHandler = (textType) => {
        if(textType === "Logout") logoutHandler();
        else if(textType === "Create") setOpen(true);
        else if(textType === "Profile") navigate(`/profile/${user?._id}`)
        else if(textType === "Home") navigate("/")
        else if(textType === "Messages") navigate("/chat")
    }

    const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notifications" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: (
      <Avatar className="w-6 h-6">
        <AvatarImage src={user?.profilePicture} alt="avatar" className="rounded-full w-6 h-6"/>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
    ];


  return <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>

    <div className='flex flex-col'>

        <div className="flex items-center gap-3 mt-4">
            <img src={logo} alt="logo" className='w-8'/>
            <h1 className='font-medium'>Hashtag</h1>
        </div>
        

        <div className="mt-2">
            {
                sidebarItems.map((item , index) => {
                    return (
                        <div

                        onClick={
                            () => sidebarHandler(item.text)
                        }

                        className='flex items-center gap-5 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'
                        key={index}>
                            {item.icon}
                            <span>{item.text}</span>

                          {
                            ((item.text === "Notifications") && (likeNotification?.length > 0)) && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  
                                    <Button
                                    onClick={(e) => e.stopPropagation()} 
                                    className="rounded-full h-5 w-5 bg-red-500 hover:bg-red-500 absolute bottom-6 left-6 cursor-pointer"
                                    size="icon">{likeNotification.length}</Button>
                                  
                                </PopoverTrigger>

                                
                                <PopoverContent className="p-1 ml-4 mt-2 h-[300px] overflow-auto">
                                  <div>
                                    {
                                      likeNotification.length === 0 ? (<p>No new notification</p>) : 
                                      (
                                        likeNotification.map((notification) => {
                                          return (
                                            <div 
                                            className='flex items-center gap-2 my-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md'
                                            key={notification.userId}>
                                              <Avatar>
                                                <AvatarImage
                                                className="w-9 h-9 rounded-full"
                                                src={notification.userDetails?.profilePicture} alt="avatar"/>
                                                <AvatarFallback>CN</AvatarFallback>
                                              </Avatar>
                                              <p
                                              className="text-sm"
                                              ><span className="font-bold">{notification.userDetails?.username} </span>liked your post
                                              </p>
                                            </div>
                                          )
                                        })
                                      )
                                    }
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )
                          }

                        </div>
                    )
                })
            }
        </div>
    </div>

    <CreatePost open={open} setOpen={setOpen}/>
    
  </div>;
};

export default LeftSidebar;
