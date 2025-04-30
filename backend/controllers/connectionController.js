// controllers/connectionController.js
import mongoose from 'mongoose';
import { User, ConnectionRequest } from '../models/index.js';

/**
 * Send a connection/friend request
 */
export const sendConnectionRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: senderId, receiverId'
      });
    }

    const senderExists = await User.exists({ _id: senderId });
    const receiverExists = await User.exists({ _id: receiverId });

    if (!senderExists || !receiverExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'One or both users not found'
      });
    }

    const alreadyFriends = await User.findOne({
      _id: senderId,
      friends: { $in: [new mongoose.Types.ObjectId(receiverId)] }
    });

    if (alreadyFriends) {
      return res.status(400).json({ 
        success: false, 
        message: 'Users are already connected'
      });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: 'pending' },
        { sender: receiverId, receiver: senderId, status: 'pending' }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'A connection request already exists between these users'
      });
    }

    const connectionRequest = new ConnectionRequest({
      sender: new mongoose.Types.ObjectId(senderId),
      receiver: new mongoose.Types.ObjectId(receiverId)
    });

    await connectionRequest.save();

    res.status(201).json({ 
      success: true, 
      message: 'Connection request sent successfully',
      requestId: connectionRequest._id
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send connection request',
      error: error.message
    }); 
  }
};

/**
 * Accept a connection/friend request
 */
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required field: requestId'
      });
    }

    const request = await ConnectionRequest.findOne({
      _id: requestId,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Connection request not found or already processed'
      });
    }

    request.status = 'accepted';
    await request.save();

    await User.findByIdAndUpdate(
      request.sender,
      { $addToSet: { friends: request.receiver } }
    );

    await User.findByIdAndUpdate(
      request.receiver,
      { $addToSet: { friends: request.sender } }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Connection request accepted successfully' 
    });
  } catch (error) {
    console.error('Error accepting connection request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to accept connection request',
      error: error.message 
    });
  }
};

/**
 * Reject a connection/friend request
 */
export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required field: requestId'
      });
    }

    const request = await ConnectionRequest.findOne({
      _id: requestId,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Connection request not found or already processed'
      });
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({ 
      success: true, 
      message: 'Connection request rejected successfully' 
    });
  } catch (error) {
    console.error('Error rejecting connection request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reject connection request',
      error: error.message 
    });
  }
};

/**
 * Get all pending connection requests for a user
 */
export const getPendingRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameter: userId'
      });
    }

    const pendingRequests = await ConnectionRequest.find({
      receiver: new mongoose.Types.ObjectId(userId),
      status: 'pending'
    }).populate({
      path: 'sender',
      select: 'name profileImage interests'
    });

    const formattedRequests = pendingRequests.map(request => ({
      requestId: request._id,
      sender: {
        id: request.sender._id,
        name: request.sender.name,
        profileImage: request.sender.profileImage,
        interests: request.sender.interests
      },
      createdAt: request.createdAt
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pending requests',
      error: error.message 
    });
  }
};
