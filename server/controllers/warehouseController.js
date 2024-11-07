import Duck from '../models/Duck.js';

export const getAllDucks = async (req, res) => {
  try {
    // sort it with deleted, quantity, descending order
    const ducks = await Duck.find({ deleted: false }).sort({ quantity: -1 });
    res.json(ducks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ducks' });
  }
};

export const addDucks = async (req, res) => {
  const { color, size, price, quantity } = req.body;

  try {
    let existingDuck = await Duck.findOne({ color, size, price });

    if (existingDuck) {
      existingDuck.quantity += quantity;
      existingDuck.deleted = false;
      await existingDuck.save();
      res.status(200).json({ message: 'Duck quantity updated', duck: existingDuck, new: false });
    } else {
      const newDuck = new Duck({ color, size, price, quantity });
      await newDuck.save();
      res.status(201).json({ message: 'New duck added', duck: newDuck, new: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to add or update duck' });
  }
};

export const editDuck = async (req, res) => {
    const { id } = req.params;
    const { price, quantity } = req.body;
  
    try {
      let existingDuck = await Duck.findOne({id});
    
      if (existingDuck) {
        existingDuck.price = price;
        existingDuck.quantity = quantity;
        await existingDuck.save();
        
        res.status(200).json({ message: 'Duck price and quantity updated', duck: existingDuck });
      } else {
        res.status(404).json({ error: 'Duck not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update duck' });
    }
  };


  export const deleteDuckListing = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedDuck = await Duck.findOneAndUpdate(
        { id }, 
        { deleted: true }
      );
  
      if (updatedDuck) {
        res.status(200).json({ message: 'Duck listing marked as deleted', duck: updatedDuck });
      } else {
        res.status(404).json({ error: 'Duck not found' });
      }
    } catch (error) {
      console.error('Error updating duck listing:', error);
      res.status(500).json({ error: 'Failed to update duck listing' });
    }
  };

// for testing purpose
  export const deleteDuck = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedDuck = await Duck.findOneAndDelete({ id }); // Use id to find and delete the document
  
      if (deletedDuck) {
        res.status(200).json({ message: 'Duck successfully deleted', duck: deletedDuck });
      } else {
        res.status(404).json({ error: 'Duck not found' });
      }
    } catch (error) {
      console.error('Error deleting duck:', error);
      res.status(500).json({ error: 'Failed to delete duck' });
    }
  };
  
  
  
  
