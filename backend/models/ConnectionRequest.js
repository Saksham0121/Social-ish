// models/ConnectionRequest.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ConnectionRequestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
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

// Create compound index to ensure uniqueness for pending requests
ConnectionRequestSchema.index(
  { sender: 1, receiver: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'pending' }
  }
);

// Update the 'updatedAt' field on save
ConnectionRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ConnectionRequest = model('ConnectionRequest', ConnectionRequestSchema);
export default ConnectionRequest;
