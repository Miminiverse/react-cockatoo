import { FcGoogle } from 'react-icons/fc';
import React, {useState, ChangeEvent, useContext, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {UserContext} from "../context/UserContext";


interface Values {
    name: string,
    email: string,
    password: string,
    confirmedPassword: string,
}

interface ToastOptions {
    position: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
    autoClose?: number;
    pauseOnHover?: boolean;
    draggable?: boolean;
    theme?: "light" | "dark";
  }


const Register = () => {

    const url = "https://todos-api-miminiverse.onrender.com/api/v1/auth/register"
    const navigate = useNavigate()

    const [user, setUser]= useContext(UserContext)

    useEffect(() => {
      const userInfo: { token: string } | null = JSON.parse(localStorage.getItem('userToken') || 'null');
      userInfo ? navigate('/home') : navigate('/')
      // userInfo ?  <Outlet /> : <Navigate to="/" />
  console.log(userInfo);
  
  }, [])


    const [values, setValues] = useState<Values>({
        name: "",
        email: "",
        password: "",
        confirmedPassword: ""
    })
    const toastOptions:ToastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };

      const handleValidation = () => {
        const { password, confirmedPassword, name, email } = values;
        if (password !== confirmedPassword) {
          toast.error(
            "Password and confirm password should be same.",
            toastOptions
          );
          return false;
        } else if (name.length < 3) {
          toast.error(
            "Username should be greater than 3 characters.",
            toastOptions
          );
          return false;
        } else if (password.length < 8) {
          toast.error(
            "Password should be equal or greater than 8 characters.",
            toastOptions
          );
          return false;
        } else if (email === "") {
          toast.error("Email is required.", toastOptions);
          return false;
        }
    
        return true;
      };

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>)  => {

        e.preventDefault()
        if (handleValidation()) {
            console.log("hit");
            const { name, email, password } = values

            const {data} = await axios.post(url, {name,email,password})

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
                        <span className="text-2xl font-semibold gray-700">Register an account</span>
                        <div className="mt-4 bg-white shadow-md rounded-lg text-left">
                            <div className="h-2 bg-yellow-400 rounded-t-md"></div>
                            <div className="px-8 py-6 ">

                                <label className="gray-700 font-semibold"> Username </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="name"
                                    onChange = {handleChange}
                                    name="name"
                                    className="border w-full h-3 px-3 py-4 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md" />
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
                                <label className="block gray-700 mt-3 font-semibold"> Confirmed Password </label>
                                <input
                                    id="confirmedPassword"
                                    type="password"
                                    placeholder="confirmed password"
                                    onChange = {handleChange}
                                    name="confirmedPassword"
                                    className="border w-full h-3 px-3 py-4 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md" />

                                <div className="flex flex-col gap-4">
                                    <button type="submit" className="mt-4 bg-yellow-400 text-gray-700  py-2 px-6 rounded-md font-medium hover:bg-yellow-400 ">
                                        Register
                                    </button>

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

export default Register