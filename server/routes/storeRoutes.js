import express from 'express';
import { createOrder } from '../controllers/storeController.js';

const storeRouter = express.Router();
storeRouter.post('/order', createOrder);

export default storeRouter;
