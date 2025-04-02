import express from 'express';
import {createCategory, getAllCategories} from '../controller/CategoryController.js'

import { validatedToken } from '../middleware/validatedToken.js';

const router = express.Router();

router.use(validatedToken);

router.get('/get-all', getAllCategories)
router.post('/create', createCategory)

export default router;