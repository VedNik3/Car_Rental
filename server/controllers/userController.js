import { User } from "../models/UserModel.js";
import { Car } from "../models/carModel.js";
import { Booking } from "../models/bookingModel.js";
import bcrypt from "bcryptjs";
import { redisClient } from "../app.js";

//GET THE USER PROFILE :
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//UPDATE USER PROFILE
// export const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const { fullname } = req.body;

//     // if (email && email !== user.email) {
//     //   const isExist = await User.findOne({ email });
//     //   if (isExist) {
//     //     res.status(400).json({ message: "email already in Use" });
//     //   }
//     //   user.email = email;
//     // }

//     //what else to change
//     if (fullname) {
//       user.fullname = fullname;
//     }

//     const updatedUser = await user.save(); //saving updated info to DB
//     res.json({
//       //sending new updated data as response
//       id: updatedUser._id,
//       fullname: updatedUser.fullname,
//       // email: updatedUser.email,
//       // role: updatedUser.role,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const updateUserProfile = async (req, res) => {
  try {
    const ownerId = req.user.id; // Get the logged-in user's ID
    const { fullname } = req.body;

    // Validate the new name
    if (!fullname || fullname.trim() === "") {
      return res.status(400).json({ message: "Name is required." });
    }

    // Find the user and update the name
    const updatedUser = await User.findByIdAndUpdate(
      ownerId,
      { fullname },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating profile." });
  }
};

export const UserBookingDetails = async (req, res) => {
  try {
    const user = req.user.id; // Extract user ID from the authenticated user

    // Find bookings for the logged-in user
    const bookings = await Booking.find({ user }).populate("car"); // Populate with car details

    // If no bookings are found
    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    // Return the bookings
    // res.status(200).json(bookings);
    return res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteuserbooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by ID
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // After deleting the booking, update the car's status to 'available'
    const carId = deletedBooking.car; // Assuming 'car' is a reference to the car's ID in the Booking schema
    await Car.findByIdAndUpdate(carId, { status: "available" });

    res
      .status(200)
      .json({ message: "Booking deleted and car marked as available." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Unable to delete booking." });
  }
};

//UPDATE USER PASSWORD
export const updatePassword = async (req, res) => {
  const { currPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE USER ACCOUNT
export const deleteUserAccount = async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all bookings associated with the user
    await Booking.deleteMany({ user: req.user.id });

    // Delete the user account
    await User.findByIdAndDelete(req.user.id);

    res.json({
      message: "User account and associated bookings deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllCars = async (req, res) => {
  try {
    let cars = null;
    const key = "cars";
    // const value = await redisClient.get(key);

    try {
          const value = await redisClient.get(key);
          if (value) {
            // cars = JSON.parse(value); 
            cars = value; 
            console.log("Cache hit");
          }
        } catch (err) {
          console.error("Redis GET error:", err);
        }

    // if (value) {
    //   // console.log(value);
    //   // cars = JSON.parse(value);
    //   cars = value;

    //   console.log("cache hit");

    // } else {
    if(!cars){
          cars = await Car.find();
          try {
        await redisClient.set(key, JSON.stringify(cars), { ex: 60 });
      } catch (err) {
        console.error("Redis SET error:", err);
      }
    }
     
      // await redisClient.set(key, JSON.stringify(cars), { ex: 60 });
      res.status(200).json(cars);
    // }
    // console.log(cars);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// export const cancelBooking = async (req, res) => {
//   const { id } = req.params; // Get booking ID from params

//   try {
//       // Find the booking by ID
//       const booking = await Booking.findById(id);
//       console.log(id);

//       if (!booking) {
//           return res.status(404).json({ message: "Booking not found" });
//       }

//       // Check if the booking is already canceled
//       if (booking.status === "canceled") {
//           return res.status(400).json({ message: "Booking is already canceled" });
//       }

//       // Update the status of the booking to "canceled"
//       booking.status = "canceled";
//       await booking.save();

//       return res.status(200).json({
//           message: "Booking canceled successfully",
//           booking,
//       });
//   } catch (error) {
//       console.error("Error canceling booking:", error);
//       return res.status(500).json({
//           message: "Internal server error while canceling the booking",
//       });
//   }
// };

export const cancelBooking = async (req, res) => {
  const { id } = req.params; // Get booking ID from params

  try {
    // Find the booking by ID
    const booking = await Booking.findById(id).populate("car"); // Populate car to get its details
    console.log(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking is already canceled
    if (booking.status === "canceled") {
      return res.status(400).json({ message: "Booking is already canceled" });
    }

    // Update the status of the booking to "canceled"
    booking.status = "canceled";
    await booking.save();

    // Update the car status to "available"
    const car = booking.car;
    if (car) {
      car.status = "available";
      await car.save();
    }

    return res.status(200).json({
      message:
        "Booking canceled successfully and car status updated to available",
      booking,
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({
      message: "Internal server error while canceling the booking",
    });
  }
};

//View Booking History (GET /api/users/:id/bookings)

//Make a New Booking (POST /api/bookings)

//Cancel Booking (DELETE /api/bookings/:bookingId)

//Forgot Password (POST /api/users/forgot-password)

//Reset Password (PUT /api/users/reset-password/:token)
// Enables the consumer to reset their password using the token sent to their email after the "forgot password" request.

//Leave a Review (POST /api/cars/:carId/reviews)
