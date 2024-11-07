import express from 'express';
import { getAllDucks, addDucks, editDuck, deleteDuck, deleteDuckListing } from '../controllers/warehouseController.js';

const router = express.Router();

router.get('/', getAllDucks);
router.post('/upsert', addDucks);
router.patch('/:id/delete', deleteDuckListing);
router.patch('/:id', editDuck);
router.delete('/:id', deleteDuck);



export default router;
