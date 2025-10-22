const Crop = require('../models/Crop')
const Farmer = require('../models/Farmer')

// @desc    Create a new crop
// @route   POST /api/crops
// @access  Public
const createCrop = async (req, res) => {
  try {
    const {
      farmerAadhar,
      seedType,
      region,
      acres,
      malePackets,
      femalePackets,
      sowingDateMale,
      sowingDateFemale,
      firstDetachingDate,
      secondDetachingDate,
      pesticide,
      harvestingDate,
      payment,
      yield
    } = req.body

    // Check if farmer exists
    const farmer = await Farmer.findOne({ aadhar: farmerAadhar })
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found with the provided Aadhar number'
      })
    }

    // Create new crop
    const crop = new Crop({
      farmerAadhar,
      seedType,
      region,
      acres,
      malePackets,
      femalePackets,
      sowingDateMale,
      sowingDateFemale,
      firstDetachingDate,
      secondDetachingDate,
      pesticide,
      harvestingDate,
      payment,
      yield
    })

    await crop.save()

    // Populate farmer details in response
    await crop.populate('farmer')

    res.status(201).json({
      success: true,
      message: 'Crop created successfully',
      data: crop
    })
  } catch (error) {
    console.error('Error creating crop:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating crop'
    })
  }
}

// @desc    Get all crops
// @route   GET /api/crops
// @access  Public
const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find()
      .populate('farmer')
      .sort({ createdAt: -1 })
    
    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    })
  } catch (error) {
    console.error('Error fetching crops:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching crops'
    })
  }
}

// @desc    Get crops by farmer Aadhar
// @route   GET /api/crops/farmer/:aadhar
// @access  Public
const getCropsByFarmerAadhar = async (req, res) => {
  try {
    const crops = await Crop.find({ farmerAadhar: req.params.aadhar })
      .populate('farmer')
      .sort({ createdAt: -1 })

    if (crops.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No crops found for this farmer'
      })
    }

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    })
  } catch (error) {
    console.error('Error fetching crops by farmer:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching crops'
    })
  }
}

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Public
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farmer')
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      })
    }

    res.status(200).json({
      success: true,
      data: crop
    })
  } catch (error) {
    console.error('Error fetching crop:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching crop'
    })
  }
}

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Public
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('farmer')

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      data: crop
    })
  } catch (error) {
    console.error('Error updating crop:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating crop'
    })
  }
}

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Public
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id)

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Crop deleted successfully',
      data: crop
    })
  } catch (error) {
    console.error('Error deleting crop:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting crop'
    })
  }
}

module.exports = {
  createCrop,
  getAllCrops,
  getCropsByFarmerAadhar,
  getCropById,
  updateCrop,
  deleteCrop
}