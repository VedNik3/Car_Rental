import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  regNumber: {
    type: String,
    required: true,
    // unique: true,
  },
  rentalStartDate: {
    type: Date,
    required: true,
  },
  rentalEndDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["booked", "ongoing", "canceled"],
    default: "booked", // Default status is "booked"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "cash"],
    required: true,
  },
  transactionId: {
    type: String,
    required: function() {
      return this.paymentStatus === "paid";
    },
  },
  rentalLocation: {
    pickupLocation: {
      type: String,
      required: true,
    },
    dropoffLocation: {
      type: String,
      required: true,
    }
  },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);