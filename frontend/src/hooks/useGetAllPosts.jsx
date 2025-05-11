import { useEffect } from 'react'
import { backend_url } from '../App'
import { useDispatch } from "react-redux"
import { setPosts } from '@/redux/postSlice';
import axios from 'axios';



const useGetAllPosts = () => {

    const dispatch = useDispatch();

    const fetchAllPost = async () => {
        try {
            const response = await axios.get(backend_url + "/api/post/allpost" ,{
                withCredentials:true
            })

            // console.log(response);
            

            if(response.data.success){
                // console.log(response.data.posts);
                
                dispatch(setPosts(response.data.posts))
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
      fetchAllPost()
    }, [])
}

export default useGetAllPosts;