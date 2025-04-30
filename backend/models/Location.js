// models/Location.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const LocationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 300 // TTL index: automatically delete documents after 5 minutes
  }
});

// Create geospatial index for location querying
LocationSchema.index({ location: '2dsphere' });

const Location = model('Location', LocationSchema);
export default Location;
