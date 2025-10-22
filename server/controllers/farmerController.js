const Farmer = require('../models/Farmer')

// @desc    Create a new farmer
// @route   POST /api/farmers
// @access  Public
const createFarmer = async (req, res) => {
  try {
    const { firstName, lastName, aadhar, mobile, village } = req.body

    // Check if farmer with same Aadhar already exists
    const existingFarmer = await Farmer.findOne({ aadhar })
    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: 'Farmer with this Aadhar number already exists'
      })
    }

    // Create new farmer
    const farmer = new Farmer({
      firstName,
      lastName,
      aadhar,
      mobile,
      village
    })

    await farmer.save()

    res.status(201).json({
      success: true,
      message: 'Farmer created successfully',
      data: farmer
    })
  } catch (error) {
    console.error('Error creating farmer:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      })
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Farmer with this Aadhar number already exists'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating farmer'
    })
  }
}

// @desc    Get all farmers
// @route   GET /api/farmers
// @access  Public
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 })
    
    res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers
    })
  } catch (error) {
    console.error('Error fetching farmers:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching farmers'
    })
  }
}

// @desc    Get farmer by Aadhar
// @route   GET /api/farmers/:aadhar
// @access  Public
const getFarmerByAadhar = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ aadhar: req.params.aadhar })
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      })
    }

    res.status(200).json({
      success: true,
      data: farmer
    })
  } catch (error) {
    console.error('Error fetching farmer:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching farmer'
    })
  }
}

// @desc    Update farmer
// @route   PUT /api/farmers/:aadhar
// @access  Public
const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findOneAndUpdate(
      { aadhar: req.params.aadhar },
      req.body,
      { new: true, runValidators: true }
    )

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Farmer updated successfully',
      data: farmer
    })
  } catch (error) {
    console.error('Error updating farmer:', error)
    
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
      message: 'Server error while updating farmer'
    })
  }
}

// @desc    Delete farmer
// @route   DELETE /api/farmers/:aadhar
// @access  Public
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findOneAndDelete({ aadhar: req.params.aadhar })

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Farmer deleted successfully',
      data: farmer
    })
  } catch (error) {
    console.error('Error deleting farmer:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting farmer'
    })
  }
}

module.exports = {
  createFarmer,
  getAllFarmers,
  getFarmerByAadhar,
  updateFarmer,
  deleteFarmer
}