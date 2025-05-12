import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link  to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className="ml-2">
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-600">{user?.bio || "Bio here..."}</span>
        </div>
      </div>

      <hr className="mt-4 w-full"/>

      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
