import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import carOwnerRoute from "./routes/carOwnerRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import Stripe from "stripe";
import errorHandler from "./middlewares/errorMiddleware.js";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
// import redis from "redis";
import { Redis } from '@upstash/redis'
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// export const redisClient = redis.createClient({
//   url:'maximum-wolf-21246.upstash.io:6379'
// });

// (async () => {
//   redisClient.on("error", (err) => {
//     console.error("Redis client error", err);
//   });

//   redisClient.on("ready", () => {
//     console.error("Redis client started"); 
//   });

//   await redisClient.connect();
//   await redisClient.ping();
   
// })();

export const redisClient = new Redis({
  url: 'https://maximum-wolf-21246.upstash.io',
  token: 'AVL-AAIjcDFhOWQzYWIzNzllYjQ0YzJlYWEzODk2M2NmOTY1MGNjY3AxMA',
})

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: ".env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// app.use(cors(corsOptions));

app.use(cors(corsOptions));


const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'DriveSphere',
          version: '1.0.0',
          description: 'API documentation for DriveSphere API application',
          contact: {
              name: 'Your Name',
              email: 'your-email@example.com',
          },
      },
      components: {
          securitySchemes: {
              BearerAuth: {
                  type: "http",
                  scheme: "bearer",
                  bearerFormat: "JWT",
              },
          },
      },
      // security: [  // Apply security globally (so all routes require authentication by default)
      //     {
      //         BearerAuth: []
      //     }
      // ],
      servers: [
          {
              url: `http://localhost:${process.env.PORT}`, // Update with your server's URL
          },
      ],
  },
  apis: ["./swaggers/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(morgan("dev"));

// app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/carOwner", carOwnerRoute);
app.use("/api/booking", bookingRoute);

// Payment Checkout Route
app.post("/checkout", async (req, res, next) => {
  try {
    const { carName, totalPrice } = req.body;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: carName },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/completed`,
      cancel_url: `${process.env.BASE_URL}/cards`,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error); // Pass error to middleware
  }
});

// Default Route for Testing
app.get("/complete", (req, res) => {
  res.send("Payment Successful");
});

// Not Found Middleware (Handles undefined routes)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Use the Error Handling Middleware
app.use(errorHandler);

// Database Connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

// Start Server
connectToDatabase().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
  });
});
