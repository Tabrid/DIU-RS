// routes/ratingRoutes.js

import express from 'express';
import { submitRating, getRatingsByUserId } from '../controllers/rating.controller.js';
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

// POST /api/ratings
router.post('/', submitRating);

// GET /api/ratings/user/:userId
router.get('/user',protectRoute, getRatingsByUserId);

export default router;
