import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign} from "lucide-react";
import { FaHeart } from "react-icons/fa6";
import { FaComment } from "react-icons/fa";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { userProfile , user } = useSelector((store) => store.auth);

  const [activeTab , setActivetab] = useState('posts')

  const isLoggedinUserProfle = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => setActivetab(tab)
  
  const displayedPost = ( activeTab === "posts" ) ? userProfile?.posts : userProfile?.bookmarks;

  // console.log(displayedPost.image);


  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">

        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profile-photo"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xl mr-2">
                  {userProfile?.username}
                </span>

                {isLoggedinUserProfle ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                      className="hover:bg-gray-200 h-8 cursor-pointer"
                      variant="secondary"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      className="hover:bg-gray-200 h-8 cursor-pointer"
                      variant="secondary"
                    >
                      View archive
                    </Button>
                    <Button
                      className="hover:bg-gray-200 h-8 cursor-pointer"
                      variant="secondary"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      className="h-8 cursor-pointer bg-gray-200"
                      variant="secondary"
                    >
                      Unfollow
                    </Button>

                    <Button
                      className="h-8 cursor-pointer bg-gray-200"
                      variant="secondary"
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-black text-white h-8 cursor-pointer hover:bg-gray-700"
                    variant="secondary"
                  >
                    Follow
                  </Button>
                )}
              </div>

                <div className="flex items-center gap-5">
                  <p className="font-semibold">{userProfile?.posts.length} <span className="text-gray-500">posts</span></p>
                  <p className="font-semibold">{userProfile?.followers.length} <span className="text-gray-500">followers</span></p>
                  <p className="font-semibold">{userProfile?.following.length} <span className="text-gray-500">following</span></p>
                </div>

                <div className="flex flex-col gap-2">

                  <span className="font-semibold">{userProfile?.bio || "bio here..."}</span>
                  <Badge className="w-fit h-7 font-semibold text-[14px] flex items-center" variant="secondary"><AtSign /><span className="pl-1">{userProfile?.username}</span></Badge>

                  <div className="flex flex-col text-sm">
                    <span>🧑‍💻 Learn coding with soni</span>
                    <span>🚀 Grow in coding</span>
                    <span>✔️ Only coding</span>
                  </div>

                </div>

            </div>
          </section>
        </div>

        <div className="border-t border-t-gray-200">


          <div className="flex items-center justify-center gap-10 text-sm">
            <span className={`py-3 cursor-pointer ${activeTab === 'posts'  ?  "font-bold border-t-2 border-t-black": ""}`} onClick={() => handleTabChange("posts")}>POSTS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ?  "font-bold border-t-2 border-t-black": ""}`} onClick={() => handleTabChange("saved")}>SAVED</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'reels'  ?  "font-bold border-t-2 border-t-black": ""}`} onClick={() => handleTabChange("reels")}>REELS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'tags'  ?  "font-bold border-t-2 border-t-black": ""}`} onClick={() => handleTabChange("tags")}>TAGS</span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {
              displayedPost?.map((post , idx) => {
                return (
                  
                  <div 
                  key={idx} 
                  className="relative group cursor-pointer">
                    <img 
                    src={post.image} 
                    alt="post-image" 
                    className="w-full aspect-square object-cover"/>

                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300">

                      <div className="flex items-center text-white space-x-4 cursor-pointer">

                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <FaHeart className="text-2xl text-white"/>
                            <span>{post?.likes.length}</span>
                          </button>

                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <FaComment className="text-2xl text-white"/>
                            <span>{post?.comments.length}</span>
                          </button>

                      </div>

                    </div>
                    
                  </div>

                )
              })
            }
          </div>


        </div>


      </div>
    </div>
  );
};

export default Profile;
