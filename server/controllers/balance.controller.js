// controllers/balanceController.js
import Balance from '../models/balance.model.js';

export const createBalance = async (req, res) => {
  try {
    const balance = new Balance(req.body);
    await balance.save();
    res.status(201).json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBalance = async (req, res) => {
  try {
    const balance = await Balance.findOne();
    if (!balance) {
      return res.status(404).json({ message: 'Balance not found' });
    }
    res.json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateNidBalance = async (req, res) => {
  try {
    const { nidBalance } = req.body;
    const balance = await Balance.findOneAndUpdate({}, { nidBalance }, { new: true });
    res.json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateServerBalance = async (req, res) => {
  try {
    const { serverBalance } = req.body;
    const balance = await Balance.findOneAndUpdate({}, { serverBalance }, { new: true });
    res.json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateBirthBalance = async (req, res) => {
  try {
    const { birthBalance } = req.body;
    const balance = await Balance.findOneAndUpdate({}, { birthBalance }, { new: true });
    res.json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTinBalance = async (req, res) => {
  try {
    const { tinBalance } = req.body;
    const balance = await Balance.findOneAndUpdate({}, { tinBalance }, { new: true });
    res.json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateBioBalance = async (req, res) => {
  try {
    const { bioBalance } = req.body;
    const balance = await Balance.findOneAndUpdate({}, { bioBalance }, { new: true });
    res.json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateRoshidBalance = async (req, res) => {
  try {
    const { roshidBalance } = req.body;
    const balance = await Balance.findOneAndUpdate({}, { roshidBalance }, { new: true });
    res.json(balance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
