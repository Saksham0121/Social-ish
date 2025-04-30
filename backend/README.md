# Nearby Users Finder Backend

This is the backend service for the nearby users finder feature. It handles user location tracking, proximity detection, and connection requests.

## Features

- **Real-time Location Broadcasting**: Users can broadcast their location to find others nearby
- **Proximity Detection**: Find users within a specified distance radius
- **Connection Management**: Send, accept, and reject connection requests
- **Automatic Data Cleanup**: Expired location data is automatically removed

## Technology Stack

- **Node.js** with **Express.js** for the API server
- **MongoDB** with **Mongoose** for data storage and GeoSpatial queries
- **GeoJSON** for handling location data

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd nearby-finder-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the provided `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection URI and other settings.

5. Start the server:
   ```
   npm start
   ```

   For development with automatic restarts:
   ```
   npm run dev
   ```

## API Endpoints

### Location API

- `POST /api/location/broadcast` - Broadcast user's current location
  - Body: `{ userId, latitude, longitude, timestamp }`

- `GET /api/location/nearby` - Find nearby users
  - Query params: `latitude`, `longitude`, `maxDistance`

### Connections API

- `POST /api/connections/request` - Send a connection request
  - Body: `{ senderId, receiverId }`

- `POST /api/connections/accept` - Accept a connection request
  - Body: `{ requestId }`

- `POST /api/connections/reject` - Reject a connection request
  - Body: `{ requestId }`