import express from "express"
import { Login, Logout, Register } from "../controllers/authController.js";
import { deleteUserAccount, getUserProfile, updatePassword, updateUserProfile, UserBookingDetails, deleteuserbooking } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

//authController.js
router.post("/register", Register);
router.post("/login", Login);
router.get("/logout",Logout);

//usrController.js
router.get("/profile", authMiddleware, getUserProfile);
router.get("/userbookingdetails", authMiddleware, UserBookingDetails);
router.put("/update", authMiddleware, updateUserProfile);
router.delete("/deleteuserbooking/:bookingId", authMiddleware,deleteuserbooking);
router.put("/updatePassword", authMiddleware, updatePassword);
router.delete("/deleteAccount", authMiddleware, deleteUserAccount);

export default router;
