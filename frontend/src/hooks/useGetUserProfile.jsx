import { useEffect, useState } from "react";
import { backend_url } from "../App";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = ( userId ) => {
  const dispatch = useDispatch();
  // const [userprofile , setUserProfile] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${backend_url}/api/user/${userId}/profile`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setUserProfile(response.data.user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
