// src/config/constants.js

// Base URL for API calls - change this to your actual backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


// Maximum time (in milliseconds) a location update is considered valid
export const LOCATION_VALIDITY_TIME = 5 * 60 * 1000; // 5 minutes

// Default radius to search for nearby users (in meters)
export const DEFAULT_SEARCH_RADIUS = 100;

// Maximum number of nearby users to return
export const MAX_NEARBY_USERS = 20;