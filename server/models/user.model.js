import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  sit: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    seats: {
      type: [seatSchema],
      default: [
        { sit: "01", available: true },
        { sit: "02", available: true },
        { sit: "03", available: true },
      ],
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    email:{
      type:String
    },
    phone:{
      type:String
    },
    personalTrips:{
      type:Number,
      default:0
    },
    shareTrips:{
      type:Number,
      default:0
    },
    distance:{
      type:Number,
      default:0
    },
    totalIncome:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
