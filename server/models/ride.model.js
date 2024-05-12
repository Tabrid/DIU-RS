import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startLocationName: {
      type: String,
      required: true,
    },
    endLocationName: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    startLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    endLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    distance: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    fare: {
      type: Number,
    },
    directionData: {
      type: Object,
    },
    status: {
      type: String,
      default: "pending",
    },
    start: {
      type: String,
      default: "pending",
    },
    end: {
      type: String,
      default: "pending",
    },
    type: {
      type: String,
      default: "share",
    },
    selectedSeats:{
      type:[]
    }
    // createdAt, updatedAt => Member since <createdAt>
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
