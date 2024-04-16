// routes/balanceRoutes.js
import express from 'express';
import { 
  createBalance, 
  getBalance, 
  updateNidBalance, 
  updateServerBalance,
  updateBirthBalance,
  updateTinBalance,
  updateBioBalance,
  updateRoshidBalance
} from '../controllers/balance.controller.js';

const router = express.Router();

// Route for creating balance
router.post('/create', createBalance);

// Route for updating NID balance
router.post('/update-nid-balance', updateNidBalance);

// Route for updating server balance
router.post('/update-server-balance', updateServerBalance);

// Route for updating birth balance
router.post('/update-birth-balance', updateBirthBalance);

// Route for updating tin balance
router.post('/update-tin-balance', updateTinBalance);

// Route for updating bio balance
router.post('/update-bio-balance', updateBioBalance);

// Route for updating roshid balance
router.post('/update-roshid-balance', updateRoshidBalance);

// Route for getting balance
router.get('/', getBalance);

export default router;
