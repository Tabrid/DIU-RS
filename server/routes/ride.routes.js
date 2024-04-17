import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  createRide,
  getAllRides,
  getRideByTransactionId,
  updateStatus,
  startRide,
  endRide,
  getAllByUserId,
  getAllByRiderIdShare,
  getAllByRiderIdPersonal
} from "../controllers/ride.controller.js";

const router = express.Router();

// Route to create a new ride
router.post("/rides", createRide);

// Route to get all rides
router.get("/rides", getAllRides);

// Route to get a ride by transactionId
router.get("/rides/:transactionId", getRideByTransactionId);
// Other routes for updating, deleting rides, etc. can be added here
router.put("/rides/status/:rideId", updateStatus);
// Start ride
router.put("/rides/start/:rideId", startRide);
// End ride
router.put("/rides/end/:rideId", endRide);
// Get all rides by user ID
router.get("/user",protectRoute, getAllByUserId);

// Get all rides by rider ID
router.get("/rider/share",protectRoute, getAllByRiderIdShare);
router.get("/rider/personal",protectRoute, getAllByRiderIdPersonal);
export default router;
