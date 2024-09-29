import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import checkRoleMiddleware from "../middlewares/checkRoleMiddleware.js";
import { addCar, CarOwnerBookingDetails, deleteCar, getAllOwnedCars, getOwnedCar, updateCarDetails, deletecarownerbooking, deletecarowner } from "../controllers/carOwnerController.js";


const router = express.Router();


//adminController.js
router.get("/getownedcar", authMiddleware,checkRoleMiddleware(["carOwner"]), getOwnedCar);
router.get("/getallownedcars", authMiddleware,checkRoleMiddleware(["carOwner"]), getAllOwnedCars);
router.post("/addcar", authMiddleware,checkRoleMiddleware(["carOwner"]), addCar);
router.get("/CarOwnerBookingDetails", authMiddleware,checkRoleMiddleware(["carOwner"]), CarOwnerBookingDetails);
router.delete("/deletecar", authMiddleware,checkRoleMiddleware(["carOwner"]), deleteCar);
router.put("/updatecardetails", authMiddleware,checkRoleMiddleware(["carOwner"]), updateCarDetails);
router.delete("/deletecarownerbooking/:bookingId", authMiddleware,checkRoleMiddleware(["carOwner"]), deletecarownerbooking);
router.delete("/deletecarowner", authMiddleware,checkRoleMiddleware(["carOwner"]), deletecarowner);
// router.post("/deletcarowner", authMiddleware,checkRoleMiddleware(["carOwner"]), deletcarowner);



export default router;