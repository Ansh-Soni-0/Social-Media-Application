import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { backend_url } from "@/App";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading , setLoading] = useState(false)
  const imageRef = useRef();

  const [input , setInput] = useState({
    profilePhoto:user?.profilePicture,
    bio:user?.bio,
    gender:user?.gender
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if(file) setInput({...input , profilePhoto : file})
  }

  const selectChangeHandler = (value) => {
    setInput({...input , gender:value})
  }



  const editProfileHandler = async () => {
    console.log(input);
    
    const formData = new FormData()
    formData.append("bio" , input.bio)
    formData.append("gender" , input.gender)
    if(input.profilePhoto) formData.append("profilePhoto" , input.profilePhoto)
    
    try {
        setLoading(true)
        const response = await axios.post(backend_url + '/api/user/profile/edit' , formData , {
            headers:{
                "Content-Type" : 'multipart/form-data'
            },
            withCredentials : true
        })

        if(response.data.success){

            const updatedUserData = {
                ...user,
                bio: response.data.user?.bio,
                profilePicture: response.data.user?.profilePicture,
                gender: response.data.user?.gender
            }

            dispatch(setAuthUser(updatedUserData))
            navigate(`/profile/${user._id}`)

            console.log(response.data);
            

            toast.success(response.data.message);

        }
    } catch (error) {
        console.log(error.message);
        toast(error.message)
    }finally{
        setLoading(false)
    }
  }

  return (
    <div className="flex max-w-2xl mx-auto pl-10 mt-10 w-[600px]">
      <section>
        
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="w-6 h-1 bg-black rounded-2xl mt-1"></div>
        

        <div className="flex items-center justify-between w-[600px] mt-10 bg-gray-200 p-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <Avatar className="w-[50px] h-[50px]">
              <AvatarImage src={user?.profilePicture} alt="avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="ml-2">
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>

          <input
           onChange={fileChangeHandler}
          type="file" className="hidden" ref={imageRef} />
          <Button
            onClick={() => imageRef?.current.click()}
            className="cursor-pointer hover:bg-gray-700"
          >
            Change photo
          </Button>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <h1 className="font-bold text-xl">Bio</h1>
          <Textarea
          onChange={(e) => setInput({...input , bio:e.target.value})}
          value={input.bio}
          name="bio" className="focus-visible:ring-transparent" />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <h1 className="font-bold text-xl">Gender</h1>

          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-[600px] cursor-pointer">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel></SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
            {
                loading ? (
                    <Button className="cursor-pointer hover:bg-gray-700 mt-5 shadow-md ">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Please wait
                    </Button>
                ) : (
                    <Button 
                    onClick={editProfileHandler}
                    className="cursor-pointer hover:bg-gray-700 mt-5 shadow-md">Submit</Button>
                )
            }
            
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
