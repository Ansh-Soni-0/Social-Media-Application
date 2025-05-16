import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { MessageCircleCode } from "lucide-react";
import { Button } from "./ui/button";
import Messages from "./Messages";
import axios from "axios";
import { backend_url } from "@/App";
import { setMessages } from "@/redux/chatSlice";
import { toast } from "sonner";

const ChatPage = () => {
  const [textMessage , setTextMessage] = useState("")
  const { user , suggestedUsers , selectedUser } = useSelector(store => store.auth);
  const { onlineUsers , messages} = useSelector(store => store.chat)
  
  const dispatch = useDispatch()

  const sendMessageHandler = async (receiverId) => {
    try {
      const response = await axios.post(backend_url + `/api/message/send/${receiverId}` , {textMessage} , {
        headers:{
          'Content-Type' : "application/json"
        },
       withCredentials: true, 
      })

      if(response.data.success){
        const safeMessages = Array.isArray(messages) ? messages : []
        dispatch(setMessages([...safeMessages, response.data.newMessage]))

        setTextMessage("")
      }

    } catch (error) {
      console.log(error);
      toast(error.message)
    }
  }

  useEffect(() => {
    //if user leave the chat page then selected user is removed 
    //cleanup
   
      return () => {
        dispatch(setSelectedUser(null))
      }

  }, [])
  
  // const isOnline = false
  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-2 px-3 text-xl ">{user?.username}</h1>
        <hr className="mb-2 border-gray-300" />

        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.filter((suggestedUser) => suggestedUser?._id !== user?._id).map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id)
            return (
              <div
              key={suggestedUser?._id}
              onClick={() => dispatch(setSelectedUser(suggestedUser))}
              className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer rounded-md">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} alt="image"/>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">{suggestedUser?.username}</span>
                    <span className={`text-xs font-bold ${isOnline ? "text-green-600": "text-red-600"}`}>{isOnline ? "online": "offline"}</span>
                </div>
              </div>
            );
          })}
        </div>


      </section>

        {
            selectedUser ?
             (
                <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
                    <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
                        <Avatar>

                        <AvatarImage src={selectedUser?.profilePicture} alt="profile"/>

                        <AvatarFallback>CN</AvatarFallback>

                        </Avatar>

                        <div className="flex flex-col">
                            <span>{selectedUser?.username}</span>
                        </div>
                    </div>

                    <Messages
                    selectedUser={selectedUser}/>

                    <div className="flex items-center p-4 border-t border-t-gray-300">
                        <Input type="text" value={textMessage} onChange={(e) => setTextMessage(e.target.value)} className="flex-1 mr-2 focus-visible:ring-transparent" placeholder="Messages..."/>
                        <Button onClick={() => sendMessageHandler(selectedUser?._id)} className="cursor-pointer">Send</Button>
                    </div>
                    
                </section>
             )
            : 
             (
                <div className="flex flex-col items-center justify-center m-auto">
                    <MessageCircleCode className="w-32 h-32 my-4"/>
                    <h1 className="font-medium text-xl">Your Messages</h1>
                    <span>Send a message to start a chat</span>
                </div>
             )
        }

    </div>
  );
};

export default ChatPage;
