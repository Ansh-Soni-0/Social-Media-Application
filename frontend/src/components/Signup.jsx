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


const Signup = () => {
 
    const [input , setInput] = useState({
        username:"",
        email:"",
        password:""
    })

    const [loading , setLoading] = useState(false)

    const navigate = useNavigate()

    const changeEventHandler = (e) => {
        setInput({...input , [e.target.name]:e.target.value})
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        
        try {

            setLoading(true)

            const response = await axios.post(backend_url + "/api/user/register", input , {
                headers :{
                "Content_Type" : "application/json",
                },
                withCredentials:true
            })
            

            if(response.data.success){

                navigate("/login")
                toast.success(response.data.message);

                setInput({
                    username:"",
                    email:"",
                    password:""
                })
                
            }

            console.log(response.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log(backend_url + "/api/user/register");
    }, [])
    
    

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


                <p className='z-100 ml-10 mb-6'>Join a vibrant community where connections thrive, ideas flow, and creativity knows no bounds.</p>


                <div className='w-30 h-2 rounded-md bg-yellow-400 shadow-md'/>

            </div>

        </div>



        {/* right part  */}
        <div className='w-full md:w-1/2 flex justify-center items-center relative mr-0 md:mr-4'>


            <div className='hidden md:block w-[65%] h-[75%] bg-yellow-400 absolute rotate-12 rounded-4xl '></div>

            <form onSubmit={signupHandler} className='shadow-2xl flex flex-col gap-5 p-8 rounded-2xl z-50 bg-white'>
                
                <div className='my-4'>
                    <p className='text-xl font-semibold text-center md:text-left'>Create Your Account & Start Exploring!</p>
                </div>

                <div>
                    <Label className='font-medium text-[17px]'>Username</Label>
                    <Input
                    onChange={changeEventHandler}
                    type="text"
                    name="username"
                    value={input.username}
                    className="focus-visible:ring-transparent my-2 font-semibold"
                    placeholder="Enter username"
                    />
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
                        className="cursor-pointer text-[17px]">Signup</Button>
                    )
                }

                <span className='font-semibold'>Already have an account
                    <Link 
                    to={"/login"}
                    className='text-blue-600 font-semibold hover:underline'> please Login</Link>
                </span>

            </form>
        </div>
    </div>
    
  )
}

export default Signup

