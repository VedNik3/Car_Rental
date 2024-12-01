import { useNavigate } from "react-router-dom";
import carImg from "../../assets/carImg.jpeg";

const Card = ({ car }) => {
  const navigate = useNavigate();

  const handleBookButton = (car) => {
    navigate("/bookingpage", { state: { car } });
  };

  return (
    <div>
      <div className="w-64 h-auto bg-white border border-gray-200 rounded-lg shadow m-2">
        <a href="#">
          <img
            className="w-full h-40 object-cover rounded-t-lg"
            src={car.images[0] || carImg}
            alt="car"
          />
        </a>
        <div className="px-5 pb-5">
          <a href="#">
            <h5 className="text-xl font-semibold tracking-tight">
              {car.brand} {car.model}
            </h5>
          </a>
          <div className="flex items-center mt-2.5 mb-5">
            {[...Array(4)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
            <svg
              className="w-4 h-4 text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ms-3">
              5.0
            </span>
          </div>
          <div className="flex gap-2 mb-5">
            <div className="bg-green-100 text-green-700 rounded-full px-2 py-1 text-xs font-semibold">
              {car.mileage} Km/Ltr
            </div>
            <div
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                car.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {car.status}
            </div>
            <div className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-semibold">
              {car.currentLocation}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Rs. {car.rentalPricePerDay}</span>
            <div
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
              onClick={() => handleBookButton(car)}
            >
              Rent Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
