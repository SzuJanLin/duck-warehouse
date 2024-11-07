import Duck from '../models/Duck.js';

export const getAllDucksTest = async (req, res) => {
  try {
    // sort it with deleted, quantity, descending order
    const ducks = await Duck.find({ deleted: false }).sort({ quantity: -1 });
    res.json(ducks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ducks' });
  }
};