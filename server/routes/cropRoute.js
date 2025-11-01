const express = require('express')
const router = express.Router()
const cropController = require('../controllers/cropController')

// Routes
router.get('/latest', cropController.getLatestUpdatedCrops)              
router.get('/', cropController.getAllCrops)                    
router.get('/:id', cropController.getCropById)   
router.get('/farmer/:aadhar', cropController.getCropsByFarmer) 
router.get('/stats', cropController.getCropStats)              
router.post('/', cropController.createCrop)                    
router.put('/:id', cropController.updateCrop)                 
router.delete('/:id', cropController.deleteCrop)               

module.exports = router