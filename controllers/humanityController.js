import HumanActivity from "../models/humanityModel.js";

export const createHumanActivity = async (req, res) => {
  try {
    const { activityType, photo, date, timeOfDay, description, location } = req.body;

    // ✅ Clean logging - only metadata, no base64 data
    console.log('📥 Human Activity Request:', {
      activityType,
      date,
      timeOfDay,
      hasPhoto: !!photo,
      photoSize: photo ? `${(photo.length / 1024).toFixed(2)} KB` : '0 KB',
      hasDescription: !!description,
      hasLocation: !!location
    });

    // Validation
    if (!activityType || !photo || !date || !timeOfDay) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const validTypes = [
      'deforestation', 'fire', 'mining', 'wastePollution', 'habitatChange',
      'construction', 'collection', 'loudNoise', 'poaching', 'invasiveSpecies', 'other'
    ];
    
    if (!validTypes.includes(activityType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity type",
      });
    }

    if (!['Morning', 'Noon', 'Evening', 'Night'].includes(timeOfDay)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time of day",
      });
    }

    // Create human activity record
    const observation = await HumanActivity.create({
      category: 'Human Activity',
      activityType,
      photo,
      date: new Date(date),
      timeOfDay,
      description: description || undefined,
      location: location || undefined,
    });

    console.log('✅ Activity created:', observation._id);

    // ✅ Return response without full photo data
    res.status(201).json({
      success: true,
      message: "Human activity observation created successfully",
      data: {
        _id: observation._id,
        category: observation.category,
        activityType: observation.activityType,
        date: observation.date,
        timeOfDay: observation.timeOfDay,
        description: observation.description,
        location: observation.location,
        status: observation.status,
        createdAt: observation.createdAt,
        updatedAt: observation.updatedAt,
        // Just indicate photo exists, don't return the full base64
        hasPhoto: true
      },
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    
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
        errors,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHumanActivities = async (req, res) => {
  try {
    // ✅ Don't select photo field to reduce response size
    const activities = await HumanActivity.find()
      .select('-photo')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching activities:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHumanActivityById = async (req, res) => {
  try {
    const activity = await HumanActivity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Error fetching activity:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateHumanActivity = async (req, res) => {
  try {
    const activity = await HumanActivity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    console.log('✅ Activity updated:', activity._id);

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: activity,
    });
  } catch (error) {
    console.error('Error updating activity:', error.message);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteHumanActivity = async (req, res) => {
  try {
    const activity = await HumanActivity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    console.log('✅ Activity deleted:', req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting activity:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHumanActivitiesByType = async (req, res) => {
  try {
    const activities = await HumanActivity.find({ 
      activityType: req.params.activityType 
    })
    .select('-photo')
    .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching activities by type:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHumanActivityStats = async (req, res) => {
  try {
    const totalActivities = await HumanActivity.countDocuments();
    
    const typeStats = await HumanActivity.aggregate([
      { $group: { _id: '$activityType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const environmental = ['fire', 'deforestation', 'mining', 'wastePollution'];
    const development = ['construction', 'habitatChange'];
    const wildlife = ['poaching', 'invasiveSpecies'];
    const other = ['collection', 'loudNoise', 'other'];

    const categoryStats = await HumanActivity.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $in: ['$activityType', environmental] }, then: 'Environmental Impacts' },
                { case: { $in: ['$activityType', development] }, then: 'Development Activities' },
                { case: { $in: ['$activityType', wildlife] }, then: 'Wildlife Related' },
                { case: { $in: ['$activityType', other] }, then: 'Other Activities' },
              ],
              default: 'Uncategorized'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentActivities = await HumanActivity.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('activityType date createdAt');

    res.status(200).json({
      success: true,
      data: { totalActivities, typeStats, categoryStats, recentActivities }
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};