import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_END_POINT } from "../../utils/constants";

const CardContainer = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null); // To handle potential errors

  const location = useSelector((state) => state.car.location);
  const filters = useSelector((state) => state.filter);

  // Ensure filters.filter exists to avoid runtime errors
  const isFiltersEmpty = filters.filter && Object.values(filters.filter).every((value) => {
    return (Array.isArray(value) && value.length === 0) || value === "";
  });

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
    <div className="flex flex-wrap gap-5 mt-5">
      {error ? <p>{error}</p> : null}

      {isFiltersEmpty &&
        cars
          .filter(
            (car) =>
              car.currentLocation === location && car.status === "available"
          )
          .map((filteredCar) => (
            <Card key={filteredCar._id} car={filteredCar} />
          ))}

      {!isFiltersEmpty &&
        cars
          .filter((car) => {
            const isLocationMatch = car.currentLocation === location;
            const isStatusAvailable = car.status === "available";
            const isBrandMatch =
              filters.filter.brand.length === 0 ||
              filters.filter.brand.includes(car.brand);
            const isTypeMatch =
              filters.filter.type.length === 0 ||
              filters.filter.type.includes(car.type);
            const isTransmissionMatch =
              filters.filter.transmission.length === 0 ||
              filters.filter.transmission.includes(car.transmission);
            const isFuelMatch =
              filters.filter.fuelType.length === 0 ||
              filters.filter.fuelType.includes(car.fuelType);

            return (
              isLocationMatch &&
              isStatusAvailable &&
              isBrandMatch &&
              isTypeMatch &&
              isTransmissionMatch &&
              isFuelMatch
            );
          })
          .map((filteredCar) => (
            <Card key={filteredCar._id} car={filteredCar} />
          ))}

      {cars.length === 0 && <h1>No cars</h1>}
    </div>
  );
};

export default CardContainer;