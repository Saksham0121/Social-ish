import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
console.log('MongoDB URI:', process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5175', // your frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Health check route for testing the server
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Interests Schema
const interestsSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    unique: true
  },
  interests: {
    hobbies: [String],
    books: [String],
    content: [String],
    communicationStyle: [String],
    friendQualities: [String],
    music: [String],
    movies: [String]
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create model from schema
const Interests = mongoose.model('Interests', interestsSchema);

// API Routes
// Get all interests (admin route)
app.get('/api/interests', async (req, res) => {
  try {
    const allInterests = await Interests.find({});
    res.json(allInterests);
  } catch (error) {
    console.error('Error fetching all interests:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get interests for a specific user
app.get('/api/interests/:uid', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching interests for userId: ${userId}`);
    
    const userInterests = await Interests.findOne({ userId });
    
    if (!userInterests) {
      console.log(`No interests found for userId: ${userId}`);
      return res.status(404).json({ message: "Interests not found for this user" });
    }
    
    console.log(`Found interests for userId: ${userId}`);
    res.json(userInterests);
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Save interests for a user
app.post('/api/interests/save', async (req, res) => {
  try {
    const { userId, interests } = req.body;
    console.log(`Saving interests for userId: ${userId}`);
    
    if (!userId || !interests) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Update or create interests document
    const result = await Interests.findOneAndUpdate(
      { userId }, 
      { 
        userId,
        interests,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log(`Successfully saved interests for userId: ${userId}`);
    res.status(200).json({ message: "Interests saved successfully", data: result });
  } catch (error) {
    console.error('Error saving interests:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});