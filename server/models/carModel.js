import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    regNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["sedan", "suv", "hatchback"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    rentalPricePerDay: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric"],
      required: true,
    },
    transmission: {
      //manual or auto
      type: String,
      enum: ["manual", "automatic"],
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    mileage: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
    },

    currentLocation: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing
carSchema.index({ brand: 1 });  
carSchema.index({ model: 1 });    
carSchema.index({ fuelType: 1 }); 

export const Car = mongoose.model("Car", carSchema);
