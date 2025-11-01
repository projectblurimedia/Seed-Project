const mongoose = require('mongoose')
const Crop = require('../models/Crop')

// Helper: Validate Aadhar
const isValidAadhar = aadhar => /^\d{12}$/.test(aadhar)

// GET all crops
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find().lean()
    res.status(200).json(crops)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET crop by ID
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).lean()
    if (!crop) return res.status(404).json({ message: 'Crop not found' })
    res.status(200).json(crop)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

exports.getLatestUpdatedCrops = async (req, res) => {
  try {
    const latestCrops = await Crop
      .find({ 'latestUpdate.date': { $exists: true } }) 
      .sort({ 'latestUpdate.date': -1 })               
      .limit(15)                                      
      .select({                                       
        farmerDetails: { firstName: 1, lastName: 1, aadhar: 1, village: 1 },
        seedType: 1,
        region: 1,
        acres: 1,
        status: 1,
        latestUpdate: 1,
        createdAt: 1
      })
      .lean()                                          
      .exec()

    res.status(200).json(latestCrops)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET crops by farmer Aadhar
exports.getCropsByFarmer = async (req, res) => {
  try {
    const { aadhar } = req.params
    if (!isValidAadhar(aadhar)) return res.status(400).json({ message: 'Invalid Aadhar' })
    const crops = await Crop.findByFarmerAadhar(aadhar)
    res.status(200).json(crops)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET crop stats
exports.getCropStats = async (req, res) => {
  try {
    const { aadhar } = req.query
    if (aadhar && !isValidAadhar(aadhar)) return res.status(400).json({ message: 'Invalid Aadhar' })
    const [stats] = await Crop.getCropStats(aadhar || null)
    res.status(200).json(stats || {})
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// POST create crop
exports.createCrop = async (req, res) => {
  try {
    const { farmerDetails } = req.body
    if (!farmerDetails || !isValidAadhar(farmerDetails.aadhar)) {
      return res.status(400).json({ message: 'Valid farmer Aadhar is required' })
    }
    
    const crop = new Crop(req.body)
    await crop.save()
    res.status(201).json(crop.getSummary())
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message })
  }
}

// PUT update crop (or append to arrays)
exports.updateCrop = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    if (updateData.farmerDetails && !isValidAadhar(updateData.farmerDetails.aadhar)) {
      return res.status(400).json({ message: 'Invalid Aadhar in farmerDetails' })
    }

    // Remove the $push operations and directly set the arrays
    // MongoDB will replace the entire arrays with the new data
    const crop = await Crop.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
    
    if (!crop) return res.status(404).json({ message: 'Crop not found' })
    
    await crop.save() 
    res.status(200).json(crop.getSummary())
  } catch (error) {
    res.status(400).json({ message: 'Invalid update data', error: error.message })
  }
}

// DELETE crop
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id)
    if (!crop) return res.status(404).json({ message: 'Crop not found' })
    res.status(200).json({ message: 'Crop deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}