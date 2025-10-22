const mongoose = require('mongoose')

const farmerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  aadhar: {
    type: String,
    required: [true, 'Aadhar number is required'],
    unique: true,
    match: [/^\d{12}$/, 'Aadhar number must be exactly 12 digits'],
    trim: true,
    index: true // Remove this line if you're using schema.index() below
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits'],
    trim: true,
    index: true // Remove this line if you're using schema.index() below
  },
  bankAccountNumber: {
    type: String,
    required: [true, 'Bank account number is required'],
    match: [/^\d{9,18}$/, 'Bank account number must be between 9 and 18 digits'],
    trim: true,
    unique: true // optional, but usually useful
  },
  village: {
    type: String,
    required: [true, 'Village name is required'],
    trim: true,
    maxlength: [100, 'Village name cannot exceed 100 characters'],
    index: true // Remove this line if you're using schema.index() below
  }
}, {
  timestamps: true
})


// Virtual for full name
farmerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Ensure virtual fields are serialized
farmerSchema.set('toJSON', { virtuals: true })
farmerSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Farmer', farmerSchema)