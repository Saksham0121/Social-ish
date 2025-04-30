// src/services/proximityService.js
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

/**
 * Service for handling proximity and location-based features
 */
const proximityService = {
  /**
   * Broadcast the current user's location to the server
   * 
   * @param {string} userId - The current user's ID
   * @param {number} latitude - Current latitude
   * @param {number} longitude - Current longitude
   * @returns {Promise} - Promise with the server response
   */
  broadcastLocation: async (userId, latitude, longitude) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/location/broadcast`, {
        userId,
        latitude,
        longitude,
        timestamp: Date.now()
      });
      return response.data;
    } catch (error) {
      console.error('Error broadcasting location:', error);
      throw error;
    }
  },

  /**
   * Fetch nearby users based on current coordinates and max distance
   * 
   * @param {number} latitude - Current latitude
   * @param {number} longitude - Current longitude
   * @param {number} maxDistance - Maximum distance in meters
   * @returns {Promise} - Promise with nearby users data
   */
  fetchNearbyUsers: async (latitude, longitude, maxDistance) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/location/nearby`, {
        params: {
          latitude,
          longitude,
          maxDistance
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby users:', error);
      throw error;
    }
  },

  /**
   * Send a connection/friend request to another user
   * 
   * @param {string} senderId - ID of the user sending the request
   * @param {string} receiverId - ID of the user to receive the request
   * @returns {Promise} - Promise with the result of the request
   */
  sendConnectionRequest: async (senderId, receiverId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/connections/request`, {
        senderId,
        receiverId,
        timestamp: Date.now()
      });
      return response.data;
    } catch (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }
  },

  /**
   * Accept a connection/friend request
   * 
   * @param {string} requestId - ID of the connection request
   * @returns {Promise} - Promise with the result of the acceptance
   */
  acceptConnectionRequest: async (requestId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/connections/accept`, {
        requestId
      });
      return response.data;
    } catch (error) {
      console.error('Error accepting connection request:', error);
      throw error;
    }
  },

  /**
   * Reject a connection/friend request
   * 
   * @param {string} requestId - ID of the connection request
   * @returns {Promise} - Promise with the result of the rejection
   */
  rejectConnectionRequest: async (requestId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/connections/reject`, {
        requestId
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting connection request:', error);
      throw error;
    }
  },

  /**
   * Get all pending connection requests for a user
   * 
   * @param {string} userId - ID of the user
   * @returns {Promise} - Promise with the pending requests
   */
  getPendingRequests: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/connections/pending/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      throw error;
    }
  }
};

export default proximityService;