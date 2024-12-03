import React, { useState } from 'react';
import '../../App.css'; // For basic styling
import { useDispatch } from 'react-redux';
import { setFilter } from '../../redux/filterSlice';

const FilterCar = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    brand: [],
    type: [],
    transmission: [],
    fuelType: [],
    price: 0,
    mileage: ''
  });

  // Handle checkbox changes for brand/type
  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilter = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value];

      return { ...prevFilters, [filterType]: updatedFilter };
    });
  };

  // Handle input changes for price and mileage
  const handleInputChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // Handle price slider change
  const handlePriceChange = (event) => {
    const newPrice = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      price: newPrice
    }));
  };

  // Dispatch filters to Redux store
  React.useEffect(() => {
    dispatch(setFilter(filters));
  }, [filters, dispatch]);

  return (
    <div className="fixed top-0 left-0 bg-white p-6 w-56 h-full shadow-lg rounded-lg ">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter Cars</h3>

      {/* Filter by Brand */}
      <div className="filter-section mb-4">
        <h4 className="text-lg font-medium text-gray-700 mb-2">Brand</h4>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="Tata"
            checked={filters.brand.includes('Tata')}
            onChange={() => handleCheckboxChange('brand', 'Tata')}
            className="mr-2"
          />
          Tata
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="Mahindra"
            checked={filters.brand.includes('Mahindra')}
            onChange={() => handleCheckboxChange('brand', 'Mahindra')}
            className="mr-2"
          />
          Mahindra
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="Hyundai"
            checked={filters.brand.includes('Hyundai')}
            onChange={() => handleCheckboxChange('brand', 'Hyundai')}
            className="mr-2"
          />
          Hyundai
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="Toyota"
            checked={filters.brand.includes('Toyota')}
            onChange={() => handleCheckboxChange('brand', 'Toyota')}
            className="mr-2"
          />
          Toyota
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="Suzuki"
            checked={filters.brand.includes('Suzuki')}
            onChange={() => handleCheckboxChange('brand', 'Suzuki')}
            className="mr-2"
          />
          Suzuki
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="Lamborghini"
            checked={filters.brand.includes('Lamborghini')}
            onChange={() => handleCheckboxChange('brand', 'Lamborghini')}
            className="mr-2"
          />
          Lamborghini
        </label>
      </div>

      {/* Filter by Model */}
      <div className="filter-section mb-4">
        <h4 className="text-lg font-medium text-gray-700 mb-2">Segment</h4>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="sedan"
            checked={filters.type.includes('sedan')}
            onChange={() => handleCheckboxChange('type', 'sedan')}
            className="mr-2"
          />
          Sedan
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="suv"
            checked={filters.type.includes('suv')}
            onChange={() => handleCheckboxChange('type', 'suv')}
            className="mr-2"
          />
          SUV
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="hatchback"
            checked={filters.type.includes('hatchback')}
            onChange={() => handleCheckboxChange('type', 'hatchback')}
            className="mr-2"
          />
          Hatchback
        </label>
      </div>

      {/* Filter by Transmission */}
      <div className="filter-section mb-4">
        <h4 className="text-lg font-medium text-gray-700 mb-2">Transmission</h4>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="manual"
            checked={filters.transmission.includes('manual')}
            onChange={() => handleCheckboxChange('transmission', 'manual')}
            className="mr-2"
          />
          Manual
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="automatic"
            checked={filters.transmission.includes('automatic')}
            onChange={() => handleCheckboxChange('transmission', 'automatic')}
            className="mr-2"
          />
          Automatic
        </label>
      </div>

      {/* Filter by Fuel */}
      <div className="filter-section mb-4">
        <h4 className="text-lg font-medium text-gray-700 mb-2">Fuel</h4>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="petrol"
            checked={filters.fuelType.includes('petrol')}
            onChange={() => handleCheckboxChange('fuelType', 'petrol')}
            className="mr-2"
          />
          Petrol
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="diesel"
            checked={filters.fuelType.includes('diesel')}
            onChange={() => handleCheckboxChange('fuelType', 'diesel')}
            className="mr-2"
          />
          Diesel
        </label>
        <label className="block text-gray-600 mb-2">
          <input
            type="checkbox"
            value="electric"
            checked={filters.fuelType.includes('electric')}
            onChange={() => handleCheckboxChange('fuelType', 'electric')}
            className="mr-2"
          />
          Electric
        </label>
      </div>

      {/* Filter by Price */}
      {/* <div className="filter-section mb-4">
        <h4 className="text-lg font-medium text-gray-700 mb-2">Price</h4>
        <input
          type="range"
          min="0"
          max="1000000" // Adjust the max price as needed
          value={filters.price}
          onChange={handlePriceChange}
          className="w-full"
        />
        <div className="text-gray-600">{`Max Price: ₹${filters.price}`}</div>
      </div> */}

      {/* Filter by Mileage */}
      {/* <div className="filter-section mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-2">Mileage</h4>
        <input
          type="number"
          placeholder="Max Mileage (km/l)"
          value={filters.mileage}
          onChange={(e) => handleInputChange('mileage', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      {/* Apply Filter Button */}
      {/* <button className="w-full py-2 bg-blue-500 text-white rounded-md font-semibold text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Apply Filters
      </button> */}
    </div>
  );
};

export default FilterCar;
