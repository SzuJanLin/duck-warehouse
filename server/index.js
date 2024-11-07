import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import duckRoutes from './routes/duckRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/ducks', duckRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
