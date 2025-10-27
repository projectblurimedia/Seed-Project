const express = require('express')
const router = express.Router()
const {
  createFarmer,
  getAllFarmers,
  getFarmerByAadhar,
  updateFarmer,
  deleteFarmer
} = require('../controllers/farmerController')

router.post('/', createFarmer)

router.get('/', getAllFarmers)

router.get('/:aadhar', getFarmerByAadhar)

router.put('/:aadhar', updateFarmer)

router.delete('/:aadhar', deleteFarmer)

module.exports = router