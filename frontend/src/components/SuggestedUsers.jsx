import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-7">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="cursor-pointer font-medium">See all</span>
      </div>

      <div className="mt-4">
        {(suggestedUsers || []).map((user) => {
          return (
            <div 
            className="flex items-center justify-between"
            key={user._id}>
              <div className="flex items-center gap-2">
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                <div className="ml-2">
                  <h1 className="font-semibold text-sm">
                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                  </h1>
                  <span className="text-gray-600">
                    {user?.bio || "Bio here..."}
                  </span>
                </div>
              </div>
              <div className="text-[#3badf8] text-sm font-bold cursor-pointer hover:text-[#3b8af8] ml-5">Follow</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;
