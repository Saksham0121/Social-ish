// routes/locationRoutes.js
import express from 'express';
import { locationController } from '../controllers/index.js';

const router = express.Router();

// POST /api/location/broadcast - Broadcast user location
router.post('/broadcast', locationController.broadcastLocation);

// GET /api/location/nearby - Find nearby users
router.get('/nearby', locationController.findNearbyUsers);

export default router;
