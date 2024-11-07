import mongoose from 'mongoose';


const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);


const duckSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    deleted: { type: Boolean, default: false }
  });
  


duckSchema.pre('save', async function (next) {
    if (this.isNew) { // Only set `id` on new documents
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'duckId' },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.sequence_value;
    }
    next();
  });

export default mongoose.model('Duck', duckSchema);
