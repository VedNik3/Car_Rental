import { Booking } from "../models/bookingModel.js";
import { Car } from "../models/carModel.js";
import { User } from "../models/UserModel.js";
import { redisClient } from "../app.js";

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
    const { email, newRole } = req.body;
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

    const del = await Booking.deleteMany({ user: user._id });

    console.log(del);

    await User.findByIdAndDelete(user._id);

    res.status(200).json({ message: "User has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Cars:
// getAllCars(): Fetch details of all cars listed on the platform.
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("ownerId", "fullname email");

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getCar with particular registration Number
export const getCar = async (req, res) => {
  try {
    const { regNumber } = req.body;

    if (!regNumber) {
      return res
        .status(400)
        .json({ message: "Registration number is required." });
    }

    const car = await Car.findOne({ regNumber });

    if (!car) {
      return res
        .status(200)
        .json({ message: "No car with this registration No. listed." });
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
      return res
        .status(400)
        .json({ message: "Car with this registration number already exists" });
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
      ownerId,
    });

    await newCar.save();

    return res.status(201).json({
      message: "Car added successfully",
      car: newCar,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add car" });
  }
};

// deleteCar(carId): Remove a car from the platform.
export const deleteCar = async (req, res) => {
  try {
    const { regNumber } = req.body;

    if (!regNumber) {
      return res
        .status(400)
        .json({ message: "Registration number is required." });
    }

    const deletedCar = await Car.deleteOne({ regNumber });

    if (deletedCar.deletedCount === 0) {
      //deleteCount = tells count of deleted entries
      return res.status(404).json({ message: "Car not found." });
    }

    res.status(200).json({ message: "Car has been deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Unable to delete the car." });
  }
};

// Get all bookings:
export const getAllBookings = async (req, res) => {
  try {
    let bookings = null;
    const key = "bookings";
    const value = await redisClient.get(key);

    if (value) {
      bookings = JSON.parse(value);
      console.log("cache hit");
    } else {
      bookings = await Booking.find({})
        .populate("user", "fullname email")
        .populate("car", "brand model regNumber");
      await redisClient.setEx(key, 60, JSON.stringify(bookings));
    }

    // const bookings = await Booking.find({});

    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error. Unable to fetch bookings." });
  }
};

export const recentBookings = async (req, res) => {
  try {
    // const CarOwnerId = req.user.id;

    // const cars = await Car.find({ ownerId: CarOwnerId });

    //   if (cars.length === 0) {
    //     return res.status(404).json({ message: "No cars found for this owner." });
    // }

    // const carIds = cars.map(car => car._id);

    const recentbookings = await Booking.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(5) // Limit to 5 bookings
      .populate("user", "fullname email")
      .populate("car", "brand model regNumber");

    if (recentbookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for these cars." });
    }

    res.status(200).json(recentbookings);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Unable to fetch booking details." });
  }
};
