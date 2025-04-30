// routes/connectionRoutes.js
import express from 'express';
import { connectionController } from '../controllers/index.js';

const router = express.Router();

// POST /api/connections/request - Send connection request
router.post('/request', connectionController.sendConnectionRequest);

// POST /api/connections/accept - Accept connection request
router.post('/accept', connectionController.acceptConnectionRequest);

// POST /api/connections/reject - Reject connection request
router.post('/reject', connectionController.rejectConnectionRequest);

// GET /api/connections/pending/:userId - Get pending requests for a user
router.get('/pending/:userId', connectionController.getPendingRequests);

export default router;
