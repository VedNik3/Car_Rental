import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Sign-Up (Register)
export const Register = async (req, res) => {
  try {
    const { fullname, email, password, mobileNo, role } = req.body;
    

    // Validate required fields
    if (!fullname || !email || !password || !role || !mobileNo) {

      console.log("role ",role);
      console.log("mobileNo ",mobileNo);
      
      
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    // Check for valid role
    const validRoles = ["user", "owner"];
    if (role === "admin") {
      return res.status(403).json({
        message: "Only admins can create users with admin role.",
        success: false,
      });
    }

    // Check if email is already in use
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        message: "User with this email already exists.",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      mobileNo,
      role, // Save the user role (either 'user' or 'owner')
    });

    return res.status(200).json({
      message: "Account created successfully.",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "Internal Server Error. Please try again later.",
      success: false,
    });
  }
};

// Login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password.",
        success: false,
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const decoded = jwt.decode(token);
    // console.log(decoded);
    const tokenExpiry = decoded.exp;
   
    
    

    return res.status(200)
      .cookie("token", token, { httpOnly: true })
      .json({
        message: `Welcome back, ${user.fullname}!`,
        success: true,
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role, 
          token: token,
          tokenExpiry : tokenExpiry,
        },
      });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      message: "Internal Server Error. Please try again later.",
      success: false,
    });
  }
};

// Logout
export const Logout = (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { expires: new Date(0), httpOnly: true })
    .json({
      message: "User logged out successfully.",
      success: true,
    });
};
