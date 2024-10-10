import { Car } from "../models/carModel.js";
import { Booking } from "../models/bookingModel.js";
import { User } from "../models/UserModel.js"

const regNumberValidation = /^(AP|AR|AS|BR|CH|DL|GA|GJ|HR|HP|JK|KA|KL|MH|MP|OD|PB|RJ|TN|UP|WB)\d{2}[A-Z]{2}\d{4}$/



// Manage Owned Cars:
// getOwnedCar(ownerId): Fetch car with reg. No. .
export const getOwnedCar = async (req, res) => {
  try {
    const { regNumber } = req.body; 
    const ownerId = req.user.id; 

    if (!regNumber) {
      return res.status(400).json({ message: "Registration number is required." });
    }

    const car = await Car.findOne({ regNumber, ownerId }); 

    if (!car) {
      return res.status(200).json({ message: "No car with this registraion No.." });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to fetch cars." });
  }
};


//getOwnedCars - all the cars of owner
export const getAllOwnedCars = async (req, res) => {
  try {
    const ownerId = req.user.id; 

    const cars = await Car.find({ownerId}); 

    if (!cars) {   
      return res.status(200).json({ message: "No cars have been added yet." });
    }

    return res.status(200).json({
      message: 'Cars retrieved successfully',
      cars
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to fetch cars." });
  }
};


// addCar(carDetails): Allow the owner to add new cars to the platform.
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

    const ownerId = req.user?._id; 

    if (!regNumber) {
      return res.status(400).json({ message: 'Registration number is required' });
    }

    if(!regNumberValidation.test(regNumber)){
      return res.status(400).json({message:"Enter valid registration number",success: false})
      
    }

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
      ownerId,
    });


    await newCar.save();

    return res.status(201).json({
      message: 'Car added successfully',
      car: newCar,
    });
  } catch (error) {
    console.error("Error while adding car:", error);

    // Add more detailed error message
    return res.status(500).json({
      message: 'Failed to add car',
      error: error.message,
    });
  }
};

// export const addCar = async (req, res) => {
//   try {
//     const newCar = new Car(req.body);
//     await newCar.save();
//     res.status(201).json({ success: true, message: 'Car added successfully' });
//   } catch (error) {
//     if (error.code === 11000) {
//       res.status(400).json({ success: false, message: 'Car with this registration number already exists' });
//     } else {
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   }
// };

export const CarOwnerBookingDetails = async (req, res) => {
  try {
    
    const CarOwnerId = req.user.id;

    const cars = await Car.find({ ownerId: CarOwnerId });

    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found for this owner." });
  }

  const carIds = cars.map(car => car._id);

  const bookings = await Booking.find({ car: { $in: carIds } })
            .populate('user', 'fullname email') 
            .populate('car', 'brand model regNumber')

 if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for these cars." });
        } 
        
        return res.status(200).json({
          message: 'Bookings retrieved successfully',
          bookings
      });    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Unable to fetch booking details." });
  }
}


// removeCar(regNumber): Allow the owner to remove cars from the platform.
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

    const deletedBookings = await Booking.deleteMany({ carRegNumber: regNumber });

    res.status(200).json({
      message: `Car and ${deletedBookings.deletedCount} associated bookings have been deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Unable to delete the car." });
  }
};


// updateCarDetails(carId, updatedDetails): Edit details of cars owned by the owner.
export const updateCarDetails = async (req, res) => {
  const { regNumber } = req.body;
  try {
    const car = await Car.findOne({ regNumber });
    if (!car) {
      return res.status(404).json({ message: "Car not found with this registration number." });
    }

    // Use Object.assign to update only provided fields
    Object.assign(car, req.body);

    const updatedCar = await car.save(); // Save updated car details

    res.status(200).json({
      message: "Car details updated successfully",
      car: updatedCar
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error. Unable to update car details." });
  }
};


export const deletecarownerbooking = async (req, res) => {
  try {
      const { bookingId } = req.params;

      const deletedBooking = await Booking.findByIdAndDelete(bookingId);

      if (!deletedBooking) {
          return res.status(404).json({ message: "Booking not found." });
      }

      const carId = deletedBooking.car; // Assuming 'car' is a reference to the car's ID in the Booking schema
    await Car.findByIdAndUpdate(carId, { status: "available" });

      res.status(200).json({ message: "Booking deleted successfully." });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error. Unable to delete booking." });
  }
};


export const deletecarowner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find the user by ID
    const user = await User.findById(ownerId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find all cars associated with the car owner
    const cars = await Car.find({ owner: ownerId });

    if (cars.length > 0) {
      // Extract car IDs
      const carIds = cars.map(car => car._id);

      // Delete all bookings related to the owner's cars
      await Booking.deleteMany({ car: { $in: carIds } });

      // Delete all cars owned by the user
      await Car.deleteMany({ owner: ownerId });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(ownerId);

    // Clear cookie and send response
    res.clearCookie('token');
    return res.status(200).json({ message: "Car owner, cars, and related bookings deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error deleting user: ${err.message}`);
  }
};

// Handle Bookings for Owned Cars:
// getBookingsForCars(ownerId): Fetch bookings made for the cars owned by the owner.
// approveBooking(bookingId): Approve a pending booking (if needed).
// declineBooking(bookingId): Decline a booking request.
// View Revenue:
// getOwnerRevenue(ownerId): View revenue generated from the cars owned by the owner.