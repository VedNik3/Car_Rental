import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { API_END_POINT } from "../utils/constants";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";
import axios from "axios";
import mainLogo from "../assets/Drivesphere2.png";

const Navbar = ({toggle,setToggle}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  const handleLogin = () => {
    navigate("/login");
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_END_POINT}/logout`);
      if (res.data.success) {
        toast.success(res.data.message);
      }
      dispatch(setUser(null));
      localStorage.removeItem("user"); // Remove user on logout

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Handle navigation to dashboard or login
  const handleDashboardClick = () => {
    if (!user) {
      const redirectPaths = {
        userDash: "/userdash",
        adminDash: "/admindash",
        carOwnerDash: "/carownerdash",
      };

      localStorage.setItem("redirectPath", JSON.stringify(redirectPaths));
      handleLogin();
    }

    if (user.role == "admin") {
      navigate("/admindash");
    } else if (user.role == "carOwner") {
      navigate("/carownerdash");
    } else {
      navigate("/userdash");
    }
  };

  // Getting back to home page on clicking logo
  const handleLogoClick = () => {
    navigate("/");
  };

  const handleToggle = () => {
    setToggle(!toggle)
  };

  console.log("toggle", toggle);
  

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-custom-gray  p-2 w-[100vw]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        {/* <img
          onClick={handleLogoClick}
          alt="Your Company"
          src={mainLogo}
          className="h-10 cursor-pointer"
        /> */}
        <h1 onClick={handleLogoClick} className="text-white text-2xl font-medium cursor-pointer"><span className="text-red-700 ">Drive</span>Sphere<span className="text-red-700 font-bold"> .</span></h1>

        <div className="flex items-center gap-5">
          {user && (
            <div
              onClick={handleDashboardClick}
              className="text-white hover:text-gray-300 cursor-pointer"
            >
              Dashboard
            </div>
          )}

          <div className="flex items-center gap-10">
            <div className="flex gap-2">
              {user && <CgProfile  size="24px" color="white" />}
              <span className="text-white">{user?.fullname}</span>
            </div>

            <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleToggle}>
              Search
            </button>

            <button
              type="button"
              onClick={user ? logoutHandler : handleLogin}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              {user ? "Signout" : "Signin"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
