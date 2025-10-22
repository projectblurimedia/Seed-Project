const express = require('express')
const router = express.Router()
const {
  createFarmer,
  getAllFarmers,
  getFarmerByAadhar,
  updateFarmer,
  deleteFarmer
} = require('../controllers/farmerController')

// @route   POST /api/farmers
// @desc    Create a new farmer
router.post('/', createFarmer)

// @route   GET /api/farmers
// @desc    Get all farmers
router.get('/', getAllFarmers)

// @route   GET /api/farmers/:aadhar
// @desc    Get farmer by Aadhar number
router.get('/:aadhar', getFarmerByAadhar)

// @route   PUT /api/farmers/:aadhar
// @desc    Update farmer by Aadhar number
router.put('/:aadhar', updateFarmer)

// @route   DELETE /api/farmers/:aadhar
// @desc    Delete farmer by Aadhar number
router.delete('/:aadhar', deleteFarmer)

module.exports = router