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
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { backend_url } from "@/App";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const LeftSidebar = () => {

    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const [open , setOpen] = useState(false)


    const logoutHandler = async () => {
        try {
            const responce = await axios.get(backend_url + "/api/user/logout" ,{withCredentials:true});

            if(responce.data.success){
              
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))

                navigate("/login")
                toast.success(responce.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    

    const sidebarHandler = (textType) => {
        if(textType === "Logout") logoutHandler();
        else if(textType === "Create") setOpen(true)
    }

    const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notification" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: (
      <Avatar className="w-6 h-6">
        <AvatarImage src={user?.profilePicture} alt="avatar" className="rounded-full"/>
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
