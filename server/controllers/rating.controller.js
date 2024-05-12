// controllers/ratingController.js

import Rating from "../models/rating.model.js";
import Ride from "../models/ride.model.js";
export const submitRating = async (req, res) => {
  try {
    const { rating, comment, riderId, userId,rideId } = req.body;

    const newRating = new Rating({
      userId,
      riderId,
      rating,
      comment,
      rideId
    });

    await newRating.save();
    await Ride.findByIdAndUpdate(rideId, { status: "done" }, { new: true });
    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getRatingsByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    

    const ratings = await Rating.find({ riderId: userId }).populate(
      "userId",
      "fullName image username"
    );

    res.status(200).json({ ratings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
