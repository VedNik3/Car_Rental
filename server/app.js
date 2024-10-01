import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js" 
import carOwnerRoute from "./routes/carOwnerRoute.js"
import bookingRoute from "./routes/bookingRoute.js"
import cors from "cors";
import cookieParser from "cookie-parser"; 

dotenv.config({ path: '.env' });

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

//cors
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/carOwner", carOwnerRoute);
app.use("/api/booking", bookingRoute);

// Database connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit the process with failure
  }
};

// Connect to the database and then start the server
connectToDatabase().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})


//useless statement