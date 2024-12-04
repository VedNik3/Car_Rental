import React, { useState } from 'react';

const CarImageSlider = ({ car }) => {
  // Assuming car.images is an array of image URLs
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length
    );
  };

  return (
    <div className="relative w-full">
      {/* Image Display */}
      <img
        src={`http://localhost:8000${car.images[currentImageIndex]}`}
        alt={`${car.brand} ${car.model}`}
        className="w-full h-44  object-cover rounded-lg mb-4"
      />

      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2  hover:bg-gray-200 px-2 pb-1 shadow-md rounded-full transition duration-300 ease-in-out text-xl font-extrabold"
      >
        &#8592;
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 transform -translate-y-1/2    hover:bg-gray-200 px-2 pb-1 shadow-md rounded-full transition duration-300 ease-in-out text-xl font-extrabold"
      >
        &#8594;
      </button>

      {/* Optional: Indicator dots for the carousel */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {car.images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2.5 h-2.5 rounded-full ${
              currentImageIndex === index ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarImageSlider;
