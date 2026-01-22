import Animal from "../models/animalModel.js";

export const createAnimal = async (req, res) => {
  try {
    console.log('POST /api/animals - Received request');
    console.log('Body size:', JSON.stringify(req.body).length, 'bytes');
    
    const { 
      animalType, 
      photo, 
      date, 
      timeOfDay, 
      description,
      location,
      commonName,      
      scientificName   
    } = req.body;

    // Validation
    if (!animalType || !photo || !date || !timeOfDay) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (animalType, photo, date, timeOfDay)",
      });
    }

    // Validate animalType - accept any non-empty string
    // The frontend may send specific animal names (e.g., "Fox") or categories (e.g., "Mammal")
    if (!animalType || typeof animalType !== 'string' || animalType.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Animal type is required and must be a non-empty string",
      });
    }

    // Validate timeOfDay
    if (!['Morning', 'Noon', 'Evening', 'Night'].includes(timeOfDay)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time of day",
      });
    }

    console.log('Creating animal observation...');
    
    // Create animal observation
    const observation = await Animal.create({
      category: 'Animal',
      animalType,
      photo,
      date,
      timeOfDay,
      description: description || undefined,
      location: location || undefined,
      commonName: commonName || undefined,          // --- ADDED ---
      scientificName: scientificName || undefined,  // --- ADDED ---
    });

    console.log('Animal observation created:', observation._id);

    res.status(201).json({
      success: true,
      message: "Animal observation created successfully",
      data: observation,
    });
  } catch (error) {
    console.error('Error creating animal observation:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry detected",
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// --- (No changes needed for get, update, delete as they are generic) ---

export const getAnimals = async (req, res) => {
  try {
    const observations = await Animal.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    console.error('Error fetching animals:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAnimalById = async (req, res) => {
  try {
    const observation = await Animal.findById(req.params.id);
    
    if (!observation) {
      return res.status(404).json({
        success: false,
        message: "Animal observation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: observation,
    });
  } catch (error) {
    console.error('Error fetching animal by ID:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "Animal observation not found",
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAnimal = async (req, res) => {
  try {
    // No changes needed here, as req.body will contain the new fields
    const observation = await Animal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!observation) {
      return res.status(404).json({
        success: false,
        message: "Animal observation not found",
      });
    }

    console.log('Animal observation updated:', observation._id);

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: observation,
    });
  } catch (error) {
    console.error('Error updating animal:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAnimal = async (req, res) => {
  try {
    const observation = await Animal.findById(req.params.id);

    if (!observation) {
      return res.status(404).json({
        success: false,
        message: "Animal observation not found",
      });
    }

    await observation.deleteOne();

    console.log('Animal observation deleted:', req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting animal:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAnimalsByType = async (req, res) => {
  try {
    const observations = await Animal.find({ 
      animalType: req.params.type 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    console.error('Error fetching animals by type:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAnimalStats = async (req, res) => {
  try {
    const totalObservations = await Animal.countDocuments();
    
    // Count by animal type
    const typeStats = await Animal.aggregate([
      {
        $group: {
          _id: '$animalType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Recent observations
    const recentObservations = await Animal.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('animalType date createdAt commonName'); // Added commonName

    res.status(200).json({
      success: true,
      data: {
        totalObservations,
        typeStats,
        recentObservations
      }
    });
  } catch (error) {
    console.error('Error fetching animal statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};