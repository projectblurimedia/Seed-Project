const express = require('express')
const router = express.Router()
const {
  createCrop,
  getAllCrops,
  getCropsByFarmerAadhar,
  getCropById,
  updateCrop,
  deleteCrop
} = require('../controllers/cropController')

// @route   POST /api/crops
// @desc    Create a new crop
router.post('/', createCrop)

// @route   GET /api/crops
// @desc    Get all crops
router.get('/', getAllCrops)

// @route   GET /api/crops/farmer/:aadhar
// @desc    Get crops by farmer Aadhar number
router.get('/farmer/:aadhar', getCropsByFarmerAadhar)

// @route   GET /api/crops/:id
// @desc    Get crop by ID
router.get('/:id', getCropById)

// @route   PUT /api/crops/:id
// @desc    Update crop by ID
router.put('/:id', updateCrop)

// @route   DELETE /api/crops/:id
// @desc    Delete crop by ID
router.delete('/:id', deleteCrop)

module.exports = router