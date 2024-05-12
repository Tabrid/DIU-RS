import Notice from '../models/notice.model.js';

const createNotice = async (req, res) => {
  try {
    console.log(req.body);
    const { title, notice } = req.body; // Assuming you also want to save the title
    const newNotice = new Notice({ title, notice }); // Assuming your Notice model has both title and notice fields
    await newNotice.save();
    res.status(201).json({ message: 'Notice created successfully' });
  } catch (err) {
    console.error('Error creating notice:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    res.status(200).json(notices);
  } catch (err) {
    console.error('Error getting notices:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { createNotice, getAllNotices };
