import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],

      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exist"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [7, "Password must be minimus 7 characters"],
      max: [15, "Password can not be greater than 15 characters"],
    },
    dob: {
      type: Date,
      required: false,
      default: Date.now,
    },
    mobileNo: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"]
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
