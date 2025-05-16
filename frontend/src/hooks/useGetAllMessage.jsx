import { useEffect } from "react";
import { backend_url } from "../App";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const response = await axios.get(
          backend_url + `/api/message/all/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          dispatch(setMessages(response.data.messages));
          // console.log(response.data.messages);
          
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessage();
  }, [selectedUser]);
};

export default useGetAllMessage;
