const mongoose = require('mongoose')

const cropSchema = new mongoose.Schema({
  farmerAadhar: {
    type: String,
    required: [true, 'Farmer Aadhar is required'],
    ref: 'Farmer',
    match: [/^\d{12}$/, 'Farmer Aadhar must be exactly 12 digits'],
    trim: true,
    index: true // Remove this line if you're using schema.index() below
  },
  seedType: {
    type: String,
    required: [true, 'Seed type is required'],
    trim: true,
    maxlength: [100, 'Seed type cannot exceed 100 characters'],
    index: true // Remove this line if you're using schema.index() below
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true,
    maxlength: [100, 'Region cannot exceed 100 characters'],
    index: true // Remove this line if you're using schema.index() below
  },
  acres: {
    type: Number,
    required: [true, 'Acres is required'],
    min: [0, 'Acres cannot be negative']
  },
  malePackets: {
    type: Number,
    required: [true, 'Male packets count is required'],
    min: [0, 'Male packets count cannot be negative']
  },
  femalePackets: {
    type: Number,
    required: [true, 'Female packets count is required'],
    min: [0, 'Female packets count cannot be negative']
  },
  sowingDateMale: {
    type: Date,
    required: [true, 'Male sowing date is required']
  },
  sowingDateFemale: {
    type: Date,
    required: [true, 'Female sowing date is required']
  },
  firstDetachingDate: {
    type: Date,
    required: [true, 'First detaching date is required']
  },
  secondDetachingDate: {
    type: Date,
    required: [true, 'Second detaching date is required']
  },
  pesticide: {
    type: String,
    required: [true, 'Pesticide is required'],
    trim: true,
    maxlength: [100, 'Pesticide cannot exceed 100 characters']
  },
  harvestingDate: {
    type: Date,
    required: [true, 'Harvesting date is required']
  },
  payment: {
    type: Number,
    required: [true, 'Payment is required'],
    min: [0, 'Payment cannot be negative']
  },
  yield: {
    type: Number,
    required: [true, 'Yield is required'],
    min: [0, 'Yield cannot be negative']
  }
}, {
  timestamps: true
})


// Virtual to populate farmer details
cropSchema.virtual('farmer', {
  ref: 'Farmer',
  localField: 'farmerAadhar',
  foreignField: 'aadhar',
  justOne: true
})

// Ensure virtual fields are serialized
cropSchema.set('toJSON', { virtuals: true })
cropSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Crop', cropSchema)