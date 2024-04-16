// routes.js
import express from 'express';
import { updateApply ,submitForm , getAllApplications, getApplicationsByUserId , updateNoteAndStatus,getApi} from '../controllers/apply.controller.js';
import { uploder } from '../middleware/uploder.js'; // Assuming you have defined the uploader middleware
import protectRoute from "../middleware/protectRoute.js";
import { uploadSingle } from '../middleware/uploadSingle.js';
const router = express.Router();

// POST route to submit form with uploader middleware
router.post('/update-form/:id',protectRoute, uploder.single("file"), uploadSingle, updateApply);
router.post('/order',protectRoute, submitForm);
router.get('/order',getAllApplications);
router.get('/push',getApi);
router.put('/order/:id',updateNoteAndStatus);
router.get('/my-order',protectRoute,getApplicationsByUserId);

// Add other routes as needed...

export default router;
