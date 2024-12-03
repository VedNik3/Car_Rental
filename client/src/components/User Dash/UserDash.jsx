import Sidebar from '../Sidebar';

import UserProfile from './UserProfile';
import { useState } from 'react';
import UserBookingDetails from './UserBookingDetails';


const UserDash = () => {
  const [clickedUserOption, setClickedUserOption] = useState("dashboard");
  console.log("--->",clickedUserOption);
  

  const renderContent = () => {
    switch (clickedUserOption) {
      case 'dashboard':
        return <div>Hi I am Vedant</div>;
      case "profile":
        return <UserProfile/>;
      case 'booking':
        return <UserBookingDetails/>;
      case 'Update/Delete Cars':
        return <div>Updating/Deleting Cars</div>;
      case 'View All Users':
        return <GetAllUsers/>;
      case 'Get User':
        return <GetUser/>;
      case 'Change User Role':
        return <ChangeRole/>;
      case 'Delete User':
        return <DeleteUser/>;
      default:
        return <div>Please select an option from the sidebar</div>;
    }
  };

  return (
    <div className="user-dash">
      <Sidebar setClickedUserOption={setClickedUserOption} />
      <div className="" >
        {renderContent()}
      </div>
    </div>
  );
};

export default UserDash;
