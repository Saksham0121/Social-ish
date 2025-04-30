// routes/interestRoutes.js
import express from 'express';
import Interest from '../models/Interests.js'; 


const router = express.Router();

// Get interests for a specific user
router.get('/interests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userInterests = await Interest.findOne({ userId });

    if (!userInterests) {
      return res.status(404).json({ message: 'No interests found for this user' });
    }

    res.status(200).json(userInterests);
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save interests for a user
router.post('/interests/save', async (req, res) => {
  try {
    const { userId, interests } = req.body;

    if (!userId || !interests) {
      return res.status(400).json({ message: 'UserId and interests are required' });
    }

    let userInterests = await Interest.findOne({ userId });

    if (userInterests) {
      userInterests.interests = interests;
      await userInterests.save();
      return res.status(200).json({ message: 'Interests updated successfully', interests: userInterests });
    } else {
      userInterests = new Interest({ userId, interests });
      await userInterests.save();
      return res.status(201).json({ message: 'Interests saved successfully', interests: userInterests });
    }
  } catch (error) {
    console.error('Error saving interests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
