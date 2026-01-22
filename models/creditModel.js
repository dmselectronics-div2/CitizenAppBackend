import mongoose from "mongoose";

const photoInformationSchema = new mongoose.Schema(
  {
    observationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    observationType: {
      type: String,
      required: true,
      enum: ["plant", "animal", "nature", "humanity"],
    },
    contactInfo: {
      type: String,
      trim: true,
    },
    canUsePhoto: {
      type: String,
      required: true,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    photoCredit: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PhotoInformation = mongoose.model("PhotoInformation", photoInformationSchema);
export default PhotoInformation;
