// controllers/locationController.js
import mongoose from 'mongoose';
import { User, Location } from '../models/index.js';

/**
 * Broadcast a user's current location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const broadcastLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude, timestamp } = req.body;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userId, latitude, longitude'
      });
    }

    // Validate user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update or create location document
    await Location.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { 
        userId: new mongoose.Types.ObjectId(userId),
        location: {
          type: 'Point',
          coordinates: [longitude, latitude] // GeoJSON format: [longitude, latitude]
        },
        timestamp: timestamp || Date.now()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Location broadcast successful' 
    });
  } catch (error) {
    console.error('Error broadcasting location:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to broadcast location',
      error: error.message 
    });
  }
};

/**
 * Find nearby users based on current location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const findNearbyUsers = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 100 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters: latitude, longitude'
      });
    }

    const timeThreshold = new Date(Date.now() - 5 * 60 * 1000);

    const nearbyLocations = await Location.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      timestamp: { $gte: timeThreshold }
    }).populate({
      path: 'userId',
      select: 'name profileImage interests'
    });

    const nearbyUsers = nearbyLocations.map(location => {
      const user = location.userId;
      return {
        id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        interests: user.interests,
        latitude: location.location.coordinates[1],
        longitude: location.location.coordinates[0],
        lastActive: location.timestamp
      };
    });

    res.status(200).json(nearbyUsers);
  } catch (error) {
    console.error('Error finding nearby users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to find nearby users',
      error: error.message 
    });
  }
};
