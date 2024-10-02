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
    price: '',
    mileage: ''
  });

  // Handle checkbox changes for brand/type
  const handleCheckboxChange = (filterType, value) => {
    setFilters((prevFilters) => {
      
      const updatedFilter = prevFilters[filterType].includes(value)   //if value is in prevFilter, remove it : else add it.
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
    console.log("neww filter", filters);
    
  };

  // console.log("neww", filters);
  dispatch(setFilter(filters));

  return (
    <div className="fixed filter-sidebar w-[100%] mt-16 ">
      <h3 className='bg-black text-white w-[100%]'>Filter Cars</h3>

      {/* Filter by Brand */}
      <div className="filter-section">
        <h4>Brand</h4>
        <label>
          <input
            type="checkbox"
            value="Toyota"
            checked={filters.brand.includes('Toyota')}  //if toyota in not in filters rhen check, otherwise uncheck
            onChange={() => handleCheckboxChange('brand', 'Toyota')}
          />
          Toyota
        </label>
        <label>
          <input
            type="checkbox"
            value="Mahindra"
            checked={filters.brand.includes('Mahindra')}
            onChange={() => handleCheckboxChange('brand', 'Mahindra')}
          />
          Mahindra
        </label>
        <label>
          <input
            type="checkbox"
            value="Lamborghini"
            checked={filters.brand.includes('Lamborghini')}
            onChange={() => handleCheckboxChange('brand', 'Lamborghini')}
          />
          Lamborghini
        </label>
      </div>

      {/* Filter by Model */}
      <div className="filter-section">
        <h4>Segment</h4>
        <label>
          <input
            type="checkbox"
            value="sedan"
            checked={filters.type.includes('sedan')}
            onChange={() => handleCheckboxChange('type', 'sedan')}
          />
          Sedan
        </label>
        <label>
          <input
            type="checkbox"
            value="suv"
            checked={filters.type.includes('suv')}
            onChange={() => handleCheckboxChange('type', 'suv')}
          />
          SUV
        </label>
        <label>
          <input
            type="checkbox"
            value="hatchback"
            checked={filters.type.includes('hatchback')}
            onChange={() => handleCheckboxChange('type', 'hatchback')}
          />
          Hatchback
        </label>
      </div>


      <div className="filter-section">
        <h4>Transmission Type</h4>
        <label>
          <input
            type="checkbox"
            value="manual"
            checked={filters.transmission.includes('manual')}
            onChange={() => handleCheckboxChange('transmission', 'manual')}
          />
          Manual
        </label>
        <label>
          <input
            type="checkbox"
            value="automatic"
            checked={filters.transmission.includes('automatic')}
            onChange={() => handleCheckboxChange('transmission', 'automatic')}
          />
          Automatic
        </label>
        </div>

      <div className="filter-section">
        <h4>Fuel</h4>
        <label>
          <input
            type="checkbox"
            value="petrol"
            checked={filters.fuelType.includes('petrol')}
            onChange={() => handleCheckboxChange('fuelType', 'petrol')}
          />
          Petrol
        </label>
        <label>
          <input
            type="checkbox"
            value="diesel"
            checked={filters.fuelType.includes('diesel')}
            onChange={() => handleCheckboxChange('fuelType', 'diesel')}
          />
          Diesel
        </label>
        </div>

      {/* Filter by Price */}
      <div className="filter-section">
        <h4>Price</h4>
        <input
          type="number"
          placeholder="Max Price"
          value={filters.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
        />
      </div>

      {/* Filter by Mileage */}
      <div className="filter-section">
        <h4>Mileage</h4>
        <input
          type="number"
          placeholder="Max Mileage (km/l)"
          value={filters.mileage}
          onChange={(e) => handleInputChange('mileage', e.target.value)}
        />
      </div>

      {/* You can add a button to apply filters */}
      <button className="apply-button">Apply Filters</button>
    </div>
  );
};

export default FilterCar;
