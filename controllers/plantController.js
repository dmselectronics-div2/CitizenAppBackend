import Plant from "../models/plantModel.js";

// ✅ Create new plant observation
export const createPlant = async (req, res) => {
  try {
    console.log('POST /api/plants - Received request');
    
    const { 
      plantCategory,
      plantType, 
      photo, 
      date, 
      timeOfDay, 
      description,
      location,
      commonName,     
      scientificName   
    } = req.body;

    // Validation
    if (!plantCategory || !plantType || !photo || !date || !timeOfDay) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (plantCategory, plantType, photo, date, timeOfDay)",
      });
    }

    // Create plant observation
    const observation = await Plant.create({
      category: 'Plant',
      plantCategory,
      plantType,
      photo,
      date,
      timeOfDay,
      description: description || undefined,
      location: location || undefined,
      commonName: commonName || undefined,
      scientificName: scientificName || undefined,
    });

    console.log('Plant observation created:', observation._id);

    res.status(201).json({
      success: true,
      message: "Plant observation created successfully",
      data: observation,
    });
  } catch (error) {
    console.error('Error creating plant observation:', error);

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

// ✅ Get all plant observations
export const getPlants = async (req, res) => {
  try {
    const observations = await Plant.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get plant by ID
export const getPlantById = async (req, res) => {
  try {
    const observation = await Plant.findById(req.params.id);
    if (!observation) {
      return res.status(404).json({ success: false, message: "Plant observation not found" });
    }
    res.status(200).json({ success: true, data: observation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get plants by category
export const getPlantsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const plants = await Plant.find({ plantCategory: category }).sort({ createdAt: -1 });

    if (!plants.length) {
      return res.status(404).json({
        success: false,
        message: `No plants found for category: ${category}`,
      });
    }

    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update plant observation
export const updatePlant = async (req, res) => {
  try {
    const observation = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!observation) {
      return res.status(404).json({ success: false, message: "Plant observation not found" });
    }
    res.status(200).json({ success: true, message: "Updated successfully", data: observation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete plant observation
export const deletePlant = async (req, res) => {
  try {
    const observation = await Plant.findById(req.params.id);
    if (!observation) {
      return res.status(404).json({ success: false, message: "Plant observation not found" });
    }
    await observation.deleteOne();
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
