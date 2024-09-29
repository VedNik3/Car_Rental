import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
// import checkRoleMiddleware from "../middlewares/checkRoleMiddleware.js";
import { booked, getAvailableCars } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/booked", authMiddleware, booked);
router.get("/availablecars",authMiddleware, getAvailableCars);



export default router;