import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js" 
import carOwnerRoute from "./routes/carOwnerRoute.js"
import bookingRoute from "./routes/bookingRoute.js"
import cors from "cors";
import cookieParser from "cookie-parser"; 
import Stripe from 'stripe';
dotenv.config({ path: '.env' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

//cors
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,
};
// const corsOptions = {
//   origin: 'http://localhost:5173', // Allow requests from this origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// };
app.use(cors(corsOptions));

// Routes
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/carOwner", carOwnerRoute);
app.use("/api/booking", bookingRoute);

app.post('/checkout', async (req, res) => {
  try {
    const { carName, totalPrice } = req.body;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: carName,
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1, // Since the total price is already provided, set quantity to 1
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/completed`,
      cancel_url: `${process.env.BASE_URL}/cards`,
    });

    console.log(session);
    
    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error: ", error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/complete', (req, res) => {
  res.send('Payment Successful')
})



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