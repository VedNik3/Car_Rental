//Handle Bookings:
// createBooking(bookingDetails): Create a new booking for a car.
// getUserBookings(userId): Get all bookings made by a specific user.
// getAllBookings(): Fetch all bookings (Admin only).
// cancelBooking(bookingId): Cancel an existing booking.
// Check Car Availability:
// checkAvailability(carId, dateRange): Check if a specific car is available for a given date range.
// Booking History:
// getBookingHistory(userId): Fetch a user's booking history.//Handle Bookings:
// createBooking(bookingDetails): Create a new booking for a car.
// getUserBookings(userId): Get all bookings made by a specific user.
// getAllBookings(): Fetch all bookings (Admin only).
// cancelBooking(bookingId): Cancel an existing booking.
// Check Car Availability:
// checkAvailability(carId, dateRange): Check if a specific car is available for a given date range.
// Booking History:
// getBookingHistory(userId): Fetch a user's booking history.

import { Car } from "../models/carModel.js";
import { Booking } from "../models/bookingModel.js";

export const booked = async (req, res) => {
    try {
        const { 
            regNumber,
            rentalStartDate,
            rentalEndDate,
            totalPrice,
            paymentStatus,
            paymentMethod,
            transactionId, 
            rentalLocation,
        } = req.body;

        const customerId = req.user.id;

        if (!regNumber) {
            return res.status(400).json({ message: "Registration number is required." });
          }

          const car = await Car.findOne({ regNumber });
          console.log("-->",car);
          

          if (!car) {
            return res.status(404).json({ message: "Car not found." });
        }

         // Check if the car is available for booking
    if (car.status === "not available" || car.status === "in service") {
      return res.status(400).json({ message: `Car is currently ${car.status}. Unable to book at this time.` });
    }

          const newBooking = new Booking({
            user: customerId,
            car: car._id,
            regNumber,
            rentalStartDate,
            rentalEndDate,
            totalPrice,
            paymentStatus,
            paymentMethod,
            transactionId,
            rentalLocation: {
                pickupLocation: rentalLocation.pickupLocation,
                dropoffLocation: rentalLocation.dropoffLocation
            },
          });

          await newBooking.save();

          car.status = "booked";
          await car.save();

          return res.status(201).json({
            message: 'booking added successfully'
          });

    } catch (error) {
        console.error(error);
    res.status(500).json({ message: "Server error. Unable to create booking." });
    }
};


//get available cars
export const getAvailableCars = async (req, res) => {
  try {
    const availableCars = await Car.find({ status: 'available' });
    res.json(availableCars);
  } catch (error) {
    console.error("Error fetching available cars:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
