import React, { useState } from 'react';
import '../../App.css'; // For basic styling

const FilterCar = () => {
  // State to manage selected filters
  const [filters, setFilters] = useState({
    brand: [],
    model: [],
    price: '',
    mileage: ''
  });

  // Handle checkbox changes for brand/model
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

  return (
    <div className="filter-sidebar w-[100%]">
      <h3>Filter Cars</h3>

      {/* Filter by Brand */}
      <div className="filter-section">
        <h4>Brand</h4>
        <label>
          <input
            type="checkbox"
            value="Toyota"
            checked={filters.brand.includes('Toyota')}
            onChange={() => handleCheckboxChange('brand', 'Toyota')}
          />
          Toyota
        </label>
        <label>
          <input
            type="checkbox"
            value="Honda"
            checked={filters.brand.includes('Honda')}
            onChange={() => handleCheckboxChange('brand', 'Honda')}
          />
          Honda
        </label>
        <label>
          <input
            type="checkbox"
            value="BMW"
            checked={filters.brand.includes('BMW')}
            onChange={() => handleCheckboxChange('brand', 'BMW')}
          />
          BMW
        </label>
      </div>

      {/* Filter by Model */}
      <div className="filter-section">
        <h4>Model</h4>
        <label>
          <input
            type="checkbox"
            value="Sedan"
            checked={filters.model.includes('Sedan')}
            onChange={() => handleCheckboxChange('model', 'Sedan')}
          />
          Sedan
        </label>
        <label>
          <input
            type="checkbox"
            value="SUV"
            checked={filters.model.includes('SUV')}
            onChange={() => handleCheckboxChange('model', 'SUV')}
          />
          SUV
        </label>
        <label>
          <input
            type="checkbox"
            value="Hatchback"
            checked={filters.model.includes('Hatchback')}
            onChange={() => handleCheckboxChange('model', 'Hatchback')}
          />
          Hatchback
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
