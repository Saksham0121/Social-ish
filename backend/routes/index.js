// routes/index.js
import express from 'express';
import locationRoutes from './locationRoutes.js';
import connectionRoutes from './connectionRoutes.js';

const router = express.Router();

// Register route modules
router.use('/location', locationRoutes);
router.use('/connections', connectionRoutes);

export default router;
