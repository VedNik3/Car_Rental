import { useSelector } from "react-redux";
import mainLogo from "../assets/mainLogo.png";
import { useNavigate } from "react-router";
import Dropdown from "./Admin Dash/DropDown";

const Sidebar = ({ setcliCkedOwnerOption }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.app.user);
  const userRole = user?.role;

  const handleLogoClick = () => {
    navigate("/");
  };

  // Dropdown data for different sections based on user role
  const carsDropdownItems = [
    { label: "Add New Car" },
    { label: "View All Cars" },
    { label: "Update/Delete Cars" },
  ];

  const usersDropdownItems = [
    { label: "View All Users" },
    { label: "Change User Role" },
    { label: "View Car Owners" },
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

  return (
    <div className="flex fixed top-0 left-0 z-9">
      <div className="flex flex-col p-4 bg-gray-900 text-white w-60 min-h-screen">
        <img
          onClick={handleLogoClick}
          alt="Your Company"
          src={mainLogo}
          className="h-10 cursor-pointer"
        />

        <hr className="border-gray-700 mb-4" />
        <ul className="flex flex-col space-y-2">
          {/* Dashboard */}
          <li>
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <span className="text-base">
                {userRole === "admin"
                  ? "Dashboard (Admin)"
                  : userRole === "carOwner" ? (
                    <span onClick={() => setcliCkedOwnerOption("dashboard")}>
                      Dashboard (Owner)
                    </span>
                  ) : "Dashboard (User)"}
              </span>
            </div>
          </li>

          {/* Cars Management (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Cars Management" items={carsDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base" onClick={() => setcliCkedOwnerOption("addcar")}>
                  Add Car
                </span>
              </div>
            </li>
          ) : (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home</span>
              </div>
            </li>
          )}

          {/* Users Management (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Users Management" items={usersDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base" onClick={() => setcliCkedOwnerOption("ownedcars")}>
                  Owned Cars
                </span>
              </div>
            </li>
          ) : (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home</span>
              </div>
            </li>
          )}

          {/* Bookings Management (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Bookings Management" items={bookingsDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base" onClick={() => setcliCkedOwnerOption("OwnerBookingDetails")}>
                  Bookings
                </span>
              </div>
            </li>
          ) : (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home</span>
              </div>
            </li>
          )}

          {/* Settings (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Settings" items={bookingsDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base" onClick={() => setcliCkedOwnerOption("Deletecarowner")}>
                  Settings
                </span>
              </div>
            </li>
          ) : (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home</span>
              </div>
            </li>
          )}

          {/* Profile Management (common for all roles) */}
          <Dropdown title="Profile" items={profileDropdownItems} />

          {/* Revenue Analytics (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Revenue Analytics" items={revenueDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home (Car Owner)</span>
              </div>
            </li>
          ) : (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home</span>
              </div>
            </li>
          )}
        </ul>

        <hr className="border-gray-700 my-4" />
        <div className="mt-auto">
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <span className="text-base">Log Out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
