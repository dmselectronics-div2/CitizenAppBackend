import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: 'Plant',
    },
    plantCategory: {
      type: String,
      required: [true, 'Plant category is required'],
      enum: ['Terrestrial', 'Aquatic'],
    },
    plantType: {
      type: String,
      required: [true, 'Plant type is required'],
      enum: [
        'plant', 'epiphyte', 'lichen', 'bryophyte', 'fungi', 'other',
        'floating', 'submerged'
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

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;