import { useEffect, useState } from 'react';
import Card from './Card';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_END_POINT } from '../utils/constants';

const CardContainer = () => {
  const [cars, setCars] = useState([]); 
  const location = useSelector(state => state.car.location);
  const [error, setError] = useState(null); // To handle potential errors
  
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(`${API_END_POINT}/allcars`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        
        setCars(res.data); 
      } catch (error) {
        console.error("Error fetching cars", error);
        setError("Failed to fetch cars"); 
      } 
    };

    fetchCars();
  }, [location]);

  return (
    <div className='flex flex-wrap mt-5 ml-[18%]'>
      {error ? <p>{error}</p> : null}

      {cars.filter(car => car.currentLocation === location && car.status === "available").map(filteredCar => (
        <Card key={filteredCar.id} car={filteredCar} />
      ))}
    </div>
  );
}

export default CardContainer;
