import './App.css'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
export const backend_url = import.meta.env.VITE_BACKEND_URL
import { createBrowserRouter , RouterProvider } from 'react-router-dom'

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

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
