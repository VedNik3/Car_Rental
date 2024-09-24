import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addCar, changeUserRole, deleteCar, getAllCars, getAllUsers, getCar, getUserById } from "../controllers/adminController.js";
import checkRoleMiddleware from "../middlewares/checkRoleMiddleware.js";


const router = express.Router();


//adminController.js
router.get("/getallusers", authMiddleware,checkRoleMiddleware(["admin"]), getAllUsers);
router.get("/getauser", authMiddleware,checkRoleMiddleware(["admin"]), getUserById);
router.post('/change-role', authMiddleware,checkRoleMiddleware(["admin"]), changeUserRole);
router.get('/getallcars', authMiddleware,checkRoleMiddleware(["admin"]), getAllCars);
router.get('/getcar', authMiddleware,checkRoleMiddleware(["admin"]), getCar);
router.post('/addcar', authMiddleware,checkRoleMiddleware(["admin"]), addCar);
router.delete('/deletecar', authMiddleware,checkRoleMiddleware(["admin"]), deleteCar);


export default router;
