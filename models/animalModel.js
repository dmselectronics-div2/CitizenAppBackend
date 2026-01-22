import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: 'Animal',
    },
    animalType: {
      type: String,
      required: [true, 'Animal type is required'],
      enum: [
        'Mammal', 
        'Bird', 
        'Reptile', 
        'Amphibian', 
        'Fish',
        'AnnelidBivalve',
        'ButterflyMoth',
        'Dragonfly',
        'Spider',
        'OtherInsect',
        'Crustacean'
      ],
    },
    photo: {
      type: String,
      required: [true, 'Photo is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    timeOfDay: {
      type: String,
      required: [true, 'Time of day is required'],
      enum: ['Morning', 'Noon', 'Evening', 'Night'],
    },
    description: {
      type: String,
      trim: true,
    },
    // --- ADDED ---
    commonName: {
      type: String,
      trim: true,
    },
    scientificName: {
      type: String,
      trim: true,
    },
    // ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Animal = mongoose.model("Animal", animalSchema);

export default Animal;