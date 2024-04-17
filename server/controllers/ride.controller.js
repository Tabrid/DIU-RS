import Ride from "../models/ride.model.js";
import User from "../models/user.model.js";
// Controller function to create a new ride
export const createRide = async (req, res) => {
  try {
    const ride = await Ride.create(req.body);
    res.status(201).json(ride);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all rides
export const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRideByTransactionId = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const ride = await Ride.findOne({ transactionId })
      .populate("rider", "fullName avaiableSit location username image role") // Populate the 'rider' field with all user fields
      .populate("user", "fullName avaiableSit location username image role"); // Populate the 'user' field with all user fields
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const { rideId } = req.params;

  try {
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { status:"done" },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Start ride
export const startRide = async (req, res) => {
  const { rideId } = req.params;

  try {
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { start: "done" },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// End ride
export const endRide = async (req, res) => {
  const { rideId } = req.params;

  try {
    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { end: "done" },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllByUserId = async (req, res) => {
  const  userId  = req.user._id; 

  try {
    const rides = await Ride.find({ user: userId });
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rides by rider ID
export const getAllByRiderIdShare = async (req, res) => {
  const riderId = req.user._id;

  try {
    const rides = await Ride.find({ rider: riderId , type: "share" }); // Filtering by riderId and type "share"
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all rides by rider ID
export const getAllByRiderIdPersonal = async (req, res) => {
  const riderId = req.user._id;

  try {
    const rides = await Ride.find({ rider: riderId , type: "personal" }); // Filtering by riderId and type "share"
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
