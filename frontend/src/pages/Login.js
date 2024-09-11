import React, { useContext, useState } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import Context from "../context";
import Cookies from 'js-cookie';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
const navigate = useNavigate();

const {fetchUserDetails, fetchUserAddToCart} = useContext(Context);


  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  console.log("Data Login", data);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
        email: data.email,
        password: data.password,
      },
      {
        withCredentials : true,
      }
    );

      // Success case
      toast.success("Login successful! Redirecting...");
      const token = response.data.data.token;
      console.log("Token:", token);
      Cookies.set('token', token, { expires: 1 });
      
      // Save token and user data to localStorage (or sessionStorage)
      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('user', JSON.stringify(response.data.user));
      fetchUserDetails();
      fetchUserAddToCart();
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      // Error case
      const errorMessage = error.response ? error.response.data.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <div id="login" className="font-serif">
      <div className="mx-auto container px-4 py-4">
        <div className="bg-white p-4 w-full max-w-sm mx-auto rounded">
          <form
            className="pt-6 pb-5 flex flex-col gap-2"
            onSubmit={handleSubmit}
          >
            <div className="grid">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <div className="bg-white-100 p-2 flex border rounded shadow mb-3">
                <input
                  type="email"
                  placeholder="enter email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full h-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <div className="bg-white-100 p-2 flex border rounded shadow mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  className="w-full h-full outline-none bg-white"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={handleShowPassword}
                >
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              <Link
                to={"/forgot-password"}
                className="block w-fit ml-auto hover:underline hover:text-purple-500"
              >
                Forgot password ?
              </Link>
            </div>

            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full mx-auto block mt-6">
              Login
            </button>
          </form>
          <p className="my-5">
            Don't have account?
            <Link
              to={"/signup"}
              className="text-purple-400 hover:underline hover:text-purple-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
