import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    avaiableSit:{
      type: Number,
      default: 2,
      required: true,
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
      default: "user", // Assuming the default role is user
    }
    // createdAt, updatedAt => Member since <createdAt>
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
