const Farmer = require('../models/Farmer')

const createFarmer = async (req, res) => {
  try {
    const { firstName, lastName, aadhar, mobile, village, bankAccountNumber } = req.body
    const existingFarmer = await Farmer.findOne({ aadhar })
    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: 'Farmer with this Aadhar number already exists'
      })
    }

    const farmer = new Farmer({
      firstName,
      lastName,
      aadhar,
      mobile,
      bankAccountNumber,
      village,
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

const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 })
    
    res.status(200).json(farmers)
  } catch (error) {
    console.error('Error fetching farmers:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching farmers'
    })
  }
}

const getFarmerByAadhar = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ aadhar: req.params.aadhar })
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      })
    }

    res.status(200).json(farmer)
  } catch (error) {
    console.error('Error fetching farmer:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching farmer'
    })
  }
}

const updateFarmer = async (req, res) => {
  try {
    const aadhar = req.params.aadhar.trim() 
    console.log("🟡 Update request received")
    console.log("Params aadhar:", aadhar)
    console.log("Update body:", req.body)

    const farmer = await Farmer.findOneAndUpdate(
      { aadhar },                         
      { $set: req.body },                 
      { new: true, runValidators: true }  
    )

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      })
    }

    console.log("✅ Updated farmer:", farmer)

    res.status(200).json({
      success: true,
      message: 'Farmer updated successfully',
      data: farmer
    })

  } catch (error) {
    console.error('❌ Error updating farmer:', error)

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
      message: 'Server error while updating farmer',
      error: error.message
    })
  }
}


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