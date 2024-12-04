import React from 'react';
import homeImage from '../../assets/image1.png';

const MainPage = () => {
  return (
    <div className='bg-red-400 h-[100%]  right-0'>
      <img 
        src={homeImage} 
        alt="A descriptive text for the image" 
        style={{ maxWidth: '40%', height: 'auto', marginLeft:'60%', marginTop:"5%" }} 
      />
    </div>
  );
};

export default MainPage;
