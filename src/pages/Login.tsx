import { FcGoogle } from 'react-icons/fc';
import React, {useState, ChangeEvent, useContext, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {UserContext} from "../context/UserContext";


interface Values {
    email: string,
    password: string,
}

interface ToastOptions {
    position: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
    autoClose?: number;
    pauseOnHover?: boolean;
    draggable?: boolean;
    theme?: "light" | "dark";
  }


const Login = () => {

    const url = "https://todos-api-miminiverse.onrender.com/api/v1/auth/login"
    const navigate = useNavigate()

    const [user, setUser]= useContext(UserContext)

    // useEffect(() => {
    //     const userInfo: { token: string } | null = JSON.parse(localStorage.getItem('userToken') || 'null');
    //     userInfo ? navigate('/home') : navigate('/')
    //     // userInfo ?  <Outlet /> : <Navigate to="/" />
    // console.log(userInfo);
    
    // }, [])


    const [values, setValues] = useState<Values>({
        email: "",
        password: "",
    })

    const toastOptions: ToastOptions  = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };
    

    const validateForm = () => {
        const { email, password } = values;
        if (email === "") {
          toast.error("Email and Password is required.", toastOptions);
          return false;
        } else if (password === "") {
          toast.error("Email and Password is required.", toastOptions);
          return false;
        }
        return true;
      };

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>)  => {
        e.preventDefault()
        if (validateForm()) {
            const { email, password } = values
            const {data} = await axios.post(
            url, 
            {email, password}
            )
            setUser({...data})
            localStorage.setItem("userToken", JSON.stringify(data.token))
            navigate('/home')
        }
    }

    const handleChange = (e:ChangeEvent<HTMLFormElement>) => {
        setValues({...values, 
        [e.target.name]: e.target.value
        })
    }
    
        
        return (
    <>

<div className="relative flex text-gray-700 antialiased justify-center overflow-hidden bg-gray-50 py-5 sm:py-10">
                <form
                    className="w-full max-w-sm"
                    onSubmit={handleSubmit}
                >
                    <div className="relative py-3 sm:w-96 text-center">
                        <span className="text-2xl font-semibold gray-700">Login</span>
                        <div className="mt-4 bg-white shadow-md rounded-lg text-left">
                            <div className="h-2 bg-yellow-400 rounded-t-md"></div>
                            <div className="px-8 py-6 ">

                                <label className="gray-700 font-semibold"> Email </label>
                                <input
                                    id="email"
                                    type="text"
                                    placeholder="email"
                                    onChange = {handleChange}
                                    name="email"
                                    className="border w-full h-3 px-3 py-4 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md" />
                                <label className="block gray-700 mt-3 font-semibold"> Password </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="password"
                                    onChange = {handleChange}
                                    name="password"
                                    className="border w-full h-3 px-3 py-4 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md" />
  
                                <div className="flex flex-col gap-4">
                                    <button type="submit" className="mt-4 bg-yellow-400 text-gray-700  py-2 px-6 rounded-md font-medium hover:bg-yellow-400 ">
                                        Login
                                    </button>

                                    <button className=" bg-gray-700 py-2 px-6 w-full  rounded-lg flex align-middle gap-5">
                                        <FcGoogle className="text-3xl" />
                                        {/* <a href="" className="no-underline font-medium text-white ">Sign in with Google</a> */}
                                    </button>
                                    <span className="text-1xl font-semibold gray-700 text-center"> Don't have an account? <Link to={"/register"}>Register</Link></span>
                                </div>

                            </div>
                        </div>
                    </div>

                </form>
                <ToastContainer />
            </div>
    </>
        )
        
}

export default Login