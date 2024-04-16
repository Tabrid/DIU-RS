// models/Balance.js
import mongoose from 'mongoose';

const balanceSchema = new mongoose.Schema({
  nidBalance: {
    type: Number,
    default: 0
  },
  serverBalance: {
    type: Number,
    default: 0
  },
  birthBalance: {
    type: Number,
    default: 0
  },
  tinBalance: {
    type: Number,
    default: 0
  },
  bioBalance: {
    type: Number,
    default: 0
  },
  roshidBalance: {
    type: Number,
    default: 0
  },
});

const Balance = mongoose.model('Balance', balanceSchema);

export default Balance;
