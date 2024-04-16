import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getUsersForSidebar,
  findUserById,
  updateBalance,
  updatePassword,
  deleteUserById,
  updateLocation,
  getAllRiders,
  updateAvailableSit,
  getAvailableSitById,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/userInfo", protectRoute, findUserById);
router.put("/update-balance", protectRoute, updateBalance);
router.put("/update-password", protectRoute, updatePassword);
router.put("/update-location", protectRoute, updateLocation);
router.delete("/users/:userId", protectRoute, deleteUserById);
router.get("/riders", getAllRiders);
router.put("/riders/:id", updateAvailableSit);
router.get("/riders/:id", getAvailableSitById);

export default router;
