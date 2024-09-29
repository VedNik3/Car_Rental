import Sidebar from '../Sidebar';
import { useSelector } from 'react-redux';

import GetAllCars from '../GetAllCars';
import AddCar from '../Owner Dash/AddCar';

const AdminDash = () => {
  const clickedOption = useSelector(state => state.admin.clickedOption); // Fetch from correct state slice

  const renderContent = () => {
    switch (clickedOption) {
      case 'View All Cars':
        return <GetAllCars/>;
      case 'Add New Car':
        return <AddCar/>;
      case 'Update/Delete Cars':
        return <div>Updating/Deleting Cars</div>;
      // Add more cases for other options
      default:
        return <div>Please select an option from the sidebar</div>;
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
