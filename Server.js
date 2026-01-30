import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import plantRoutes from "./Routes/plantRoutes.js";
import natureRoutes from "./Routes/natureRoutes.js";
import animalRoutes from "./Routes/animalRoutes.js";
import humanActivityRoutes from './Routes/humanityRoutes.js';
import { errorHandler } from "./Middlewares/errorMiddlewares.js";
import CreditRoutes from "./Routes/CreditRoutes.js";
import PhotoInformation from "./models/creditModel.js";




// console.log('animalRoutes type:', typeof animalRoutes);
// console.log('CreditRoutes type:', typeof CreditRoutes);


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect DB
connectDB();

// Root Route
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running...",
    endpoints: {
      users: "/api/users",
      plants: "/api/plants",
      nature: "/api/nature",
      animals: "/api/animals",
      humanity:"/api/human-activities",
      photoInformation:"/api/photo-information",

      
      
    }
  });
});



// API Routes
// console.log('Registering /api/users...');
app.use("/api/users", userRoutes);

// console.log('Registering /api/plants...');
app.use("/api/plants", plantRoutes);

// console.log('Registering /api/nature...');
app.use("/api/nature", natureRoutes);

// console.log('Registering /api/animals...');
app.use("/api/animals", animalRoutes);

// app.use("/api/humanity",humanityRoutes);
app.use("/api/photo-information", CreditRoutes);

app.use('/api/human-activities', humanActivityRoutes);

// Handle PATCH /api/:type/:id/photo-info for all observation types
const typeMapping = {
  'plants': 'plant',
  'animals': 'animal',
  'nature': 'nature',
  'human-activities': 'humanity'
};

app.patch('/api/:type/:id/photo-info', async (req, res) => {
  try {
    const { type, id } = req.params;
    const { contactInfo, canUsePhoto, photoCredit } = req.body;

    const observationType = typeMapping[type];
    if (!observationType) {
      return res.status(400).json({
        success: false,
        message: `Invalid observation type: ${type}`,
      });
    }

    // Convert boolean/string values to "Yes" or "No"
    let canUsePhotoValue = 'Yes';
    if (canUsePhoto === false || canUsePhoto === 'false' || canUsePhoto === 'No' || canUsePhoto === 'no') {
      canUsePhotoValue = 'No';
    }

    const photoInformation = new PhotoInformation({
      observationId: id,
      observationType,
      contactInfo,
      canUsePhoto: canUsePhotoValue,
      photoCredit,
    });
    await photoInformation.save();

    res.status(201).json({
      success: true,
      message: 'Photo information submitted successfully!',
      data: photoInformation,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    console.error('Photo information submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit photo information',
      error: error.message,
    });
  }
});

// console.log('All routes registered!');

// 404 Handler
app.use((req, res) => {
  console.log(` 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Server running on http://localhost:${PORT}`);
  
  // console.log(`Users: http://localhost:${PORT}/api/users`);
  // console.log(`Plants: http://localhost:${PORT}/api/plants`);
  // console.log(`Nature: http://localhost:${PORT}/api/nature`);
  // console.log(`Animals: http://localhost:${PORT}/api/animals`);

});

export default app;