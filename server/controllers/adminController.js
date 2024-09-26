import { Booking } from "../models/bookingModel.js";
import { Car } from "../models/carModel.js";
import { User } from "../models/UserModel.js";

// Manage Users:

//Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getUser: Fetch a user by email
export const getUser = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("-password"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Send the user data as response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to fetch the user" });
  }
};


// Update a user role
export const changeUserRole = async (req, res) => {
  try {
    const { email, newRole } = req.body; //admin will give new role in form/button
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User does not exist" });
    }

    user.role = newRole;
    await user.save();
    res.status(200).json({ message: "User role has changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deleteUser(userId): Remove a user from the platform.
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(user._id); // Use the user's ID for deletion
    res.status(200).json({ message: "User has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Manage Cars:
// getAllCars(): Fetch details of all cars listed on the platform.
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// getCar with particular registration Number
export const getCar = async (req, res) => {
  try {
    const { regNumber } = req.body; 

    if (!regNumber) {
      return res.status(400).json({ message: "Registration number is required." });
    }

    const car = await Car.findOne({ regNumber });

    if (!car) {
      return res.status(200).json({ message: "No car with this registration No. listed." });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to fetch car." });
  }
};


// Add a new car to the platform
export const addCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      regNumber,
      type,
      color,
      rentalPricePerDay,
      fuelType,
      transmission,
      seats,
      status,
      mileage,
      description,
      images,
      currentLocation,
    } = req.body;

    const ownerId = req.user._id;

    const isCarExist = await Car.findOne({ regNumber });
    if (isCarExist) {
      return res.status(400).json({ message: 'Car with this registration number already exists' });
    }

    const newCar = new Car({
      brand,
      model,
      year,
      regNumber,
      type,
      color,
      rentalPricePerDay,
      fuelType,
      transmission,
      seats,
      status,
      mileage,
      description,
      images,
      currentLocation,
      ownerId, // owner is the mediator or admin adding the car
    });


    await newCar.save();

  
    return res.status(201).json({
      message: 'Car added successfully',
      car: newCar,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add car' });
  }
};


// deleteCar(carId): Remove a car from the platform.
export const deleteCar = async (req, res) => {
  try {
    const { regNumber } = req.body;

    if (!regNumber) {
      return res.status(400).json({ message: "Registration number is required." });
    }

    const deletedCar = await Car.deleteOne({ regNumber });

    if (deletedCar.deletedCount === 0) { //deleteCount = tells count of deleted entries
      return res.status(404).json({ message: "Car not found." });
    }

    res.status(200).json({ message: "Car has been deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to delete the car." });
  }
};

// Get all bookings:
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings); 

  } catch (error) {
    res.status(500).json({ message: "Server error. Unable to fetch bookings." });
  }
};




// View Reports:
// viewBookingReport(): View statistics and reports related to car bookings.
// viewRevenue(): View total revenue generated by the platform

// Manage Website Settings:
// updateSettings(): Modify website-wide settings (e.g., rental policies, payment settings).