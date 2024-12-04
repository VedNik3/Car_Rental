import Sidebar from '../Sidebar';
import { useSelector } from 'react-redux';

import GetAllCars from '../GetAllCars';
import AddCar from '../Owner Dash/AddCar';
import GetAllUsers from './GetAllUsers';
import ChangeRole from './ChangeRole';
import DeleteUser from './DeleteUser';
import GetUser from './GetUser';
import RevenueReport from '../RevenueReport';

const AdminDash = () => {
  const clickedOption = useSelector(state => state.admin.clickedOption); 
  console.log(">>>",clickedOption);
  

  const renderContent = () => {
    switch (clickedOption) {
      case 'View All Cars':
        return <GetAllCars/>;
      case 'Add New Car':
        return <AddCar/>;
      case 'Delete car':
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
        return <RevenueReport/>;
    }
  };

  return (
    <div className="admin-dash">
      <Sidebar />
      <div className="content-area ml-[40%] mt-12">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDash;
