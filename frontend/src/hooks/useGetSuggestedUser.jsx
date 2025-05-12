import { useEffect } from "react";
import { backend_url } from "../App";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSuggestedUsers } from "@/redux/authSlice";

const useGetSuggestedUser = () => {
  const dispatch = useDispatch();

  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get(backend_url + "/api/user/suggested", {
        withCredentials: true,
      });

      if (response.data.success) {

        dispatch(setSuggestedUsers(response.data.users));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);
};

export default useGetSuggestedUser;
