// interestModel.js
import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  interests: {
    hobbies: {
      type: [String],
      default: []
    },
    books: {
      type: [String],
      default: []
    },
    content: {
      type: [String],
      default: []
    },
    communicationStyle: {
      type: [String],
      default: []
    },
    friendQualities: {
      type: [String],
      default: []
    },
    music: {
      type: [String],
      default: []
    },
    movies: {
      type: [String],
      default: []
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the 'updatedAt' field
interestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Interest = mongoose.model('Interest', interestSchema);
export default Interest;
