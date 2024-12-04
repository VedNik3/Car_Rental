import { useSelector } from "react-redux";
import mainLogo from "../assets/Drivesphere2.png";
import { useNavigate } from "react-router";
import Dropdown from "./Admin Dash/DropDown";
import { useDispatch } from "react-redux";
import { setClickedOption } from "../redux/adminSlice";
import { CgProfile } from "react-icons/cg";
import { IoCarSportOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { RiDashboardLine } from "react-icons/ri";
import { FaCar } from "react-icons/fa";

const Sidebar = ({ setClickedUserOption, setcliCkedOwnerOption }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const userRole = user?.role;

  const handleLogoClick = () => {
    navigate("/");
  };

  // Dropdown data for different sections based on user role
  const carsDropdownItems = [
    { label: "View All Cars" },
    { label: "Delete car" },
  ];

  const usersDropdownItems = [
    { label: "View All Users" },
    { label: "Change User Role" },
    { label: "View Car Owners" },
    { label: "Get User" },
    { label: "Delete User" },
  ];

  const bookingsDropdownItems = [
    { label: "View All Bookings" },
    { label: "Add/Delete Bookings" },
  ];

  const profileDropdownItems = [
    { label: "View Profile" },
    { label: "Edit Profile" },
  ];

  const revenueDropdownItems = [
    { label: "View Admin Revenue" },
    { label: "View Car Owners' Revenue" },
  ];

  const handleLogOut = () => {
    // Implement logout functionality here (e.g., clearing session, redirecting)
    navigate("/login"); // Example: Navigate to login page after logout
  };

  return (
    <div className="flex fixed top-0 left-0 z-9">
      <div className="flex flex-col p-4 bg-gray-900 text-white w-60 min-h-screen">
        {/* <img
          onClick={handleLogoClick}
          alt="Your Company"
          src={mainLogo}
          className="ml-5  mb-5 h-11 w-32 cursor-pointer"
        /> */}
        <h1
          onClick={handleLogoClick}
          className="text-white text-2xl font-medium cursor-pointer ml-5  mb-3 h-11"
        >
          <span className="text-red-700 ">Drive</span>Sphere
          <span className="text-red-700 font-bold"> .</span>
        </h1>

        <hr className="border-gray-700 mb-4" />
        <ul className="flex flex-col space-y-2">
          {/* Dashboard */}
          <li>
            <div
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => {
                userRole === "carOwner"
                  ? setcliCkedOwnerOption("dashboard")
                  : userRole === "user"
                  ? setClickedUserOption("booking")
                  : dispatch(setClickedOption("dashboard"));
              }}
            >
              <span className="text-base flex items-center gap-2">
                {userRole === "admin" && (
                  <>
                    <RiDashboardLine size="20px" color="white" />
                    Dashboard (Admin)
                  </>
                )}
                {userRole === "carOwner" && (
                  <>
                    <RiDashboardLine size="20px" color="white" />
                    Dashboard (Owner)
                  </>
                )}
              </span>
            </div>
          </li>

          {/* Cars Management (for Admin only) */}
          {userRole === "admin" && (
            <Dropdown
              title={
                <span className="flex gap-1 items-center">
                  <CgProfile size="20px" color="white" />
                  Car Management
                </span>
              }
              items={carsDropdownItems}
            />
          )}

          {/* User management & profile sections */}
          {userRole === "admin" ? (
            <>
              <Dropdown
                title={
                  <span className="flex gap-1 items-center">
                    <CgProfile size="20px" color="white" />
                    User Management
                  </span>
                }
                items={usersDropdownItems}
              />
              <Dropdown
                title={
                  <span className="flex gap-1 items-center">
                    <CgProfile size="20px" color="white" />
                    Booking Management
                  </span>
                }
                items={bookingsDropdownItems}
              />
              {/* <Dropdown
                title="Revenue Analytics"
                items={revenueDropdownItems}
              /> */}
            </>
          ) : userRole === "carOwner" ? (
            <>
              <li>
                <div
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setcliCkedOwnerOption("addcar")}
                >
                  <span className="text-base">Add Car</span>
                </div>
              </li>
              <li>
                <div
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setcliCkedOwnerOption("ownedcars")}
                >
                  <span className="text-base">Owned Cars</span>
                </div>
              </li>
              <li>
                <div
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setcliCkedOwnerOption("OwnerBookingDetails")}
                >
                  <span className="text-base">Bookings</span>
                </div>
              </li>
            </>
          ) : (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setClickedUserOption("profile")}
              >
                <span className="text-base flex gap-2 items-center ">
                  <CgProfile size="20px" color="white" /> Profile
                </span>
              </div>
            </li>
          )}

          {/* Users Management (for Admin only) */}
          {/* {userRole === "carOwner" ? (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setcliCkedOwnerOption("Deletecarowner")}
              >
                <span className="text-base">Settings</span>
              </div>
            </li>
          ) : (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setClickedUserOption("booking")}
              >
                <span className="text-base flex gap-2 items-center "><IoCarSportOutline  size="20px" color="white" />Bookings</span>
              </div>
            </li>
          )} */}

          <li>
            {userRole === "carOwner" && (
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setcliCkedOwnerOption("ownedcars")}
              >
                <span className="text-base">Owned Cars</span>
              </div>
            )}

            {userRole === "user" && (
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setClickedUserOption("booking")}
              >
                <span className="text-base flex gap-2 items-center">
                  <IoCarSportOutline size="20px" color="white" />
                  Bookings
                </span>
              </div>
            )}
          </li>

          {userRole === "user" && (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setClickedUserOption("Delete User")}
              >
                <span className="text-base flex gap-2 items-center ">
                  <IoSettingsOutline size="20px" color="white" />
                  Settings
                </span>
              </div>
            </li>
          )}

          {/* Profile Management (common for all roles) */}
          {/* <Dropdown title="Profile" items={profileDropdownItems} /> */}

          {/* Settings (for Admin only) */}
          {userRole === "admin" && (
            <Dropdown title="Settings" items={bookingsDropdownItems} />
          )}
        </ul>

        <hr className="border-gray-700 my-4" />
        <div className="mt-auto">
          <div
            className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={handleLogOut}
          >
            <span className="text-base flex gap-2 items-center ">
              <MdLogout size="20px" color="white" />
              Logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
