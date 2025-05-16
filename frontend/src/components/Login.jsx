import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import logo from '../assets/logo.png';
import axios from 'axios';
import { toast } from 'sonner';
import { backend_url } from '@/App';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';


const Login = () => {
 
    const [input , setInput] = useState({
        email:"",
        password:""
    })

    const [loading , setLoading] = useState(false)
    
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const {user} = useSelector(store => store.auth)

    const changeEventHandler = (e) => {
        setInput({...input , [e.target.name]:e.target.value})
    }


    const signupHandler = async (e) => {
        e.preventDefault();
        // console.log(input);
        
        try {

            setLoading(true)

            const response = await axios.post(backend_url + "/api/user/login", input , {
                headers :{
                "Content_Type" : "application/json",
                },
                withCredentials:true
            })
            

            if(response.data.success){

                dispatch(setAuthUser(response.data.user));

                navigate("/")
                toast.success(response.data.message);

                setInput({
                    email:"",
                    password:""
                })
                
            }

            // console.log(response.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     if(user) {
    //         navigate("/")
    //     }
    // }, [])
    
    

  return (

    <div className='w-screen h-screen flex flex-col md:flex-row p-4 md:p-10'>

        {/* left part */}
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center mb-8 md:mb-0 md:ml-5'>

            <div className="flex items-center gap-5">
                <img src={logo} alt="logo" className='w-16'/>
                <h1 className='w-full font-medium text-3xl'>Hashtag</h1>
            </div>

            <div className='text-4xl font-semibold h-[80%] flex items-center justify-center relative flex-col gap-2'>

                <div
                className='hidden sm:flex justify-around w-full'>
                    <div className='w-30 h-2 rounded-md bg-yellow-400 shadow-md'/>
                    <div className='w-30 h-2 rounded-md bg-yellow-400 shadow-md'/>
                </div>


                <p className='z-100 ml-10 mb-6'>Welcome back! Log in to connect with friends, share your moments, and explore new content.</p>


                <div className='w-30 h-2 rounded-md bg-yellow-400 shadow-md'/>

            </div>

        </div>



        {/* right part  */}
        <div className='w-full md:w-1/2 flex justify-center items-center relative mr-0 md:mr-4'>


            <div className='hidden md:block w-[65%] h-[75%] bg-yellow-400 absolute rotate-12 rounded-4xl '></div>

            <form onSubmit={signupHandler} className='shadow-2xl flex flex-col gap-5 p-8 rounded-2xl z-50 bg-white justify-center'>

                <div className="flex items-center gap-5 w-full">
                    <h1 className='font-bold text-2xl'>Welcome back to</h1>
                    <img src={logo} alt="logo" className='w-8'/>
                </div>
                
                <div className='my-2'>
                    <p className='text-xl font-semibold text-center md:text-left'>Log in to Continue Connecting with Friends</p>
                </div>

                <div>
                    <Label className='font-medium text-[17px]'>Email</Label>
                    <Input
                    onChange={changeEventHandler} 
                    type="text"
                    name="email"
                    value={input.email}
                    className="focus-visible:ring-transparent my-2 font-semibold"
                    placeholder="Enter email"
                    />
                </div>
                <div>
                    <Label className='font-medium text-[17px]'>Password</Label>
                    <Input
                    onChange={changeEventHandler} 
                    type="text"
                    name="password"
                    value={input.password}
                    className="focus-visible:ring-transparent my-2 font-semibold"
                    placeholder="Enter Password"
                    />
                </div>


                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            please wait
                        </Button>
                    ) : (
                        <Button 
                        type="submit"
                        className="cursor-pointer text-[17px]">Login Account
                        </Button>
                    )
                }

                

                <span className='font-semibold'>Dosen't have an Account? 
                    <Link 
                    to={"/signup"}
                    className='text-blue-600 font-semibold hover:underline'> Signup</Link>
                </span>

            </form>
        </div>
    </div>
    
  )
}

export default Login

