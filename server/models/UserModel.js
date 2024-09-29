import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,  
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensures email is unique
        match: [/.+\@.+\..+/, "Please enter a valid email address"],  
    },
    password: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        match: /^[0-9]{10}$/, // Ensures the value is exactly 10 digits
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Ensures only digits are used
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    
    role: {
        type: String,
        enum: ['user', 'carOwner', 'admin'],  // Define allowed roles
        default: 'user',  // Default role is 'user'
        required: true,
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);