import {UserContext} from "../context/UserContext";
import { useContext, useEffect } from "react"

import { Outlet, Navigate, useNavigate } from 'react-router-dom';

// const useAuth = () => {
//     const user = {loggedIn: null}
//     return user && user.loggedIn




const PrivateRoutes = () => {
    const [user, setUser] = useContext(UserContext)
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const userInfo: { token: string } | null = JSON.parse(localStorage.getItem('userToken') || 'null');
    //     userInfo ? navigate('/home') : navigate('/')
    //     // userInfo ?  <Outlet /> : <Navigate to="/" />
    // console.log(userInfo);
    
    // }, [navigate])

    // console.log(user.token);






    
    
    return user && user.loggedIn && user.token ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoutes