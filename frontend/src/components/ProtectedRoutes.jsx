import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectedRoutes = ({Children}) => {

    const {user} = useSelector(store => store.auth)
    const navigate = useNavigate()

    useEffect(() => {
        console.log(user);
        
      if(!user){
        navigate("/login")
      }
    }, [])

  return <>{Children}</>
}

export default ProtectedRoutes