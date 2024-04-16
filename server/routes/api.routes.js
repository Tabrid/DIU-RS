// dataRoutes.js

import express from 'express';
import { fetchData, success,addressSearch, findRoutes } from '../controllers/api.controller.js';
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post('/data',protectRoute, fetchData);
router.post('/success', success);
router.get('/address', addressSearch);
router.post('/findRoutes', addressSearch);

export default router;
