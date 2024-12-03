import { useState } from 'react'
import Sidebar from '../Sidebar'
import AddCar from './AddCar';
import OwnedCars from './OwnedCars';
import OwnerBookingDetails from './OwnerBookingDetails';
import DeleteCarOwner from './DeleteCarOwner';
import RevenueReport from '../RevenueReport';

const CarOwnerDash = () => {
  const [clickedOwnerOption, setcliCkedOwnerOption] = useState("dashboard");

  const renderclickedOwnerOption = () => {
    switch (clickedOwnerOption) {
      case "dashboard":
        return <RevenueReport/>;
      case "addcar":
        return <AddCar />;
      case "OwnerBookingDetails":
        return <OwnerBookingDetails />;
      case "ownedcars":
        return <OwnedCars />;
      case "Deletecarowner":
        return <DeleteCarOwner />;
      default:
        return <div>Defaulted</div>;
    }
  };

  const isRevenueReport = clickedOwnerOption === "dashboard";

  return (
    <div>
      <Sidebar setcliCkedOwnerOption={setcliCkedOwnerOption}/>
      {/* <div className="flex-grow p-4"> */}
      <div className={`flex-grow p-4 ${isRevenueReport ? 'ml-[16%]' : 'ml-[41%]'}`}>
        {renderclickedOwnerOption()}
      </div>
    </div>
  )
}

export default CarOwnerDash
