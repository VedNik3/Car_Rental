import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { API_END_POINT } from "../utils/constants.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice.js";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mobileNoRef = useRef();
  const roleRef = useRef("user");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleLoginMode = () => {
    setIsLogin((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const mobileNo = mobileNoRef.current?.value;
    const selectedRole = roleRef.current;

    if (!isLogin && (!mobileNo || !/^\d{10}$/.test(mobileNo))) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    const user = isLogin
      ? { email, password }
      : { fullname, email, password, role: selectedRole, mobileNo };

    const url = `${API_END_POINT}/${isLogin ? "login" : "register"}`;
    const successMessage = isLogin
      ? "Login successful!"
      : "Registration successful!";

    try {
      const res = await axios.post(url, user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(successMessage);
        if (isLogin) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          dispatch(setUser(res.data.user));
          // console.log(">>>", res.data.user.role);
        
          const userRole = res.data.user.role;
        
          // Safely get redirectPath from localStorage
          const redirectPaths = JSON.parse(localStorage.getItem("redirectPath")) || {};
        
          let redirectPath;
          if (userRole === "user") {
            redirectPath = redirectPaths.userDash;
          } else if (userRole === "admin") {
            redirectPath = redirectPaths.adminDash;
          } else {
            redirectPath = redirectPaths.carOwnerDash || "/"; 
          }
      
          navigate(redirectPath || "/");
          localStorage.removeItem("redirectPath");
        
        } else {
          setIsLogin(true);
        }
        
        setFullname("");
        setEmail("");
        setPassword("");
        if (mobileNoRef.current) {
          mobileNoRef.current.value = "";
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `${isLogin ? "Login" : "Registration"} failed`
      );
    }
  };

  return (
    <div className="relative w-full h-screen bg-[url('https://images.unsplash.com/photo-1598084991519-c90900bc9df0?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center flex items-center">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="flex flex-1 justify-center items-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center mb-7 text-gray-800">
            {isLogin ? "Sign in to your account" : "Create New Account"}
          </h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fullname"
                >
                  Fullname
                </label>
                <input
                  id="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Enter your fullname"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="mobile-no"
                >
                  Mobile No.
                </label>
                <input
                  ref={mobileNoRef}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  id="mobile-no"
                  placeholder="Enter your mobile number"
                  maxLength="10"
                />
              </div>
            )}

            {!isLogin && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Role
                </label>
                <div className="flex items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      defaultChecked
                      onChange={() => (roleRef.current = "user")}
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2">User</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="role"
                      value="carOwner"
                      onChange={() => (roleRef.current = "carOwner")}
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2">Car Owner</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-bold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
            <div className="text-center mt-4 flex justify-between">
              <span
                className="mr-5 cursor-pointer text-sm text-indigo-500 hover:text-indigo-700"
                onClick={toggleLoginMode}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
              <a
                href="#"
                className="text-sm text-indigo-500 hover:text-indigo-700"
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
