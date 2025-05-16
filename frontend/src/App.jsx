import { useEffect } from 'react'
import './App.css'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import {io} from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/realTimeNotiSlice'
export const backend_url = import.meta.env.VITE_BACKEND_URL

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout />,
    children:[
      {
        path:'/',
        element:<Home />
      },
      {
        path:'/profile/:id',
        element:<Profile />
      },
      {
        path:'/account/edit',
        element:<EditProfile />
      },
      {
        path:'/chat',
        element:<ChatPage />
      }
    ]
  },
  {
    path:"/login",
    element:<Login />
  },
  {
    path:"/signup",
    element:<Signup />
  }
])

function App() {

  const {user} = useSelector(store => store.auth)
  const {socket} = useSelector(store => store.socketio)
  const dispatch = useDispatch()

  useEffect(() => {
 
    if(user){
      const socketio = io("http://localhost:8000" , {
        query: {
          userId: user?._id
        },
        transports:["websocket"]
      });
      dispatch(setSocket(socketio))

      //listening all the events
      socketio.on("getOnlineUsers" , (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      });

      socketio.on('notification' , (notification) => {
        // console.log("notification" , notification);
        dispatch(setLikeNotification(notification))
      })

      //cleanup when user direct cut the page then also show the offline
      return () => {
        socketio.close();
        dispatch(setSocket(null))
      }
    } else if(socket) {
      socket?.close();
      dispatch(setSocket(null))
    }

  }, [user , dispatch])
  

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
