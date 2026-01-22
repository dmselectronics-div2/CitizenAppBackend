import Nature from "../models/natureModel.js";

// Create new nature observation
export const createNature = async (req, res) => {
  try {
    console.log(' POST /api/nature - Received request');
    console.log('Body size:', JSON.stringify(req.body).length, 'bytes');
    
    const { 
      natureType, 
      photo, 
      date, 
      timeOfDay, 
      description,
      location 
    } = req.body;

    // Validation
    if (!natureType || !photo || !date || !timeOfDay) {
      console.log('Validation failed');
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    console.log('Creating nature observation...');
    console.log('Type:', natureType);
    console.log('Date:', date);
    console.log('Time:', timeOfDay);

    const observation = await Nature.create({
      category: 'Nature',
      natureType,
      photo,
      date,
      timeOfDay,
      description: description || undefined,
      location: location || undefined,
    });

    console.log('Nature observation created:', observation._id);

    res.status(201).json({
      success: true,
      message: "Nature observation created successfully",
      data: observation,
    });
  } catch (error) {
    console.error(' Error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all nature observations
export const getNatureObservations = async (req, res) => {
  try {
    const observations = await Nature.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    console.error('Error fetching nature:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get nature by ID
export const getNatureById = async (req, res) => {
  try {
    const observation = await Nature.findById(req.params.id);
    
    if (!observation) {
      return res.status(404).json({
        success: false,
        message: "Nature observation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: observation,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "Nature observation not found",
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update nature observation
export const updateNature = async (req, res) => {
  try {
    const observation = await Nature.findByIdAndUpdate(
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
        message: "Nature observation not found",
      });
    }

    console.log('Nature observation updated:', observation._id);

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: observation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete nature observation
export const deleteNature = async (req, res) => {
  try {
    const observation = await Nature.findById(req.params.id);

    if (!observation) {
      return res.status(404).json({
        success: false,
        message: "Nature observation not found",
      });
    }

    await observation.deleteOne();

    console.log('Nature observation deleted:', req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get nature by type
export const getNatureByType = async (req, res) => {
  try {
    const observations = await Nature.find({ 
      natureType: req.params.type 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get nature statistics
export const getNatureStats = async (req, res) => {
  try {
    const totalObservations = await Nature.countDocuments();
    
    const typeStats = await Nature.aggregate([
      {
        $group: {
          _id: '$natureType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const recentObservations = await Nature.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('natureType date createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalObservations,
        typeStats,
        recentObservations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};