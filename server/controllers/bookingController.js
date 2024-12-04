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
import cron  from "node-cron";

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


// const updateCarStatuses = async () => {
//   try {
//       const currentTime = new Date();

//       // Find bookings where rentalEndDate has passed
//       const expiredBookings = await Booking.find({
//           rentalEndDate: { $lte: currentTime }, // Rentals that have ended
//       });

//       for (let booking of expiredBookings) {
//           const carId = booking.car;
//           console.log(carId);

//           // Update the car's status to "available"
//           await Car.findByIdAndUpdate(carId, { status: "available" });

//           // Optionally, delete the booking if it's no longer needed
//           // await Booking.findByIdAndDelete(booking._id);
//       }

//       console.log(`Updated statuses for ${expiredBookings.length} cars.`);
//   } catch (err) {
//       console.error("Error updating car statuses:", err);
//   }
// };

// // const cron = require("node-cron");

// // Schedule the job to run every hour
// cron.schedule("0 * * * *", updateCarStatuses);

const updateCarStatuses = async () => {
  try {
      const currentTime = new Date();

      // Find bookings where rentalEndDate has passed
      const expiredBookings = await Booking.find({
          rentalEndDate: { $lte: currentTime }, // Rentals that have ended
      });

      for (let booking of expiredBookings) {
          const carId = booking.car;
          console.log(carId);

          // Find the car to check its current status
          const car = await Car.findById(carId);

          // Only update the status if it's not already "available"
          if (car && car.status !== "available") {
              // Update the car's status to "available"
              await Car.findByIdAndUpdate(carId, { status: "available" });
              console.log(`Updated car ${carId} status to available.`);
          } else {
              console.log(`Car ${carId} is already available.`);
          }

          // Optionally, delete the booking if it's no longer needed
          // await Booking.findByIdAndDelete(booking._id);
      }

      console.log(`Updated statuses for ${expiredBookings.length} cars.`);
  } catch (err) {
      console.error("Error updating car statuses:", err);
  }
};

const updateBookingStatuses = async () => {
  try {
      const currentTime = new Date();

      // Find bookings where rentalEndDate has passed and status is not "canceled"
      const expiredBookings = await Booking.find({
          rentalEndDate: { $lte: currentTime }, // Rentals that have ended
          status: { $ne: "canceled" }, // Only bookings that are not canceled
      });

      for (let booking of expiredBookings) {
          // Update the booking status to "completed"
          await Booking.findByIdAndUpdate(booking._id, { status: "completed" });
          console.log(`Booking ${booking._id} status updated to completed.`);
      }

      console.log(`Updated statuses for ${expiredBookings.length} bookings.`);
  } catch (err) {
      console.error("Error updating booking statuses:", err);
  }
};

// Schedule the job to run every hour
// cron.schedule("* * * * * *", updateCarStatuses); 
// cron.schedule("* * * * * *", updateBookingStatuses);
