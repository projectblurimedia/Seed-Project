const mongoose = require('mongoose')

const pesticideEntrySchema = new mongoose.Schema({
  pesticide: {
    type: String,
    required: [true, 'Pesticide name is required'],
    trim: true,
    maxlength: [100, 'Pesticide name cannot exceed 100 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Pesticide application date is required']
  }
}, { _id: true })

const coolieEntrySchema = new mongoose.Schema({
  work: {
    type: String,
    required: [true, 'Work type is required'],
    trim: true,
    maxlength: [100, 'Work type cannot exceed 100 characters']
  },
  count: {
    type: Number,
    required: [true, 'Coolie count is required'],
    min: [0, 'Coolie count cannot be negative']
  },
  amount: {
    type: Number,
    required: [true, 'Coolie amount is required'],
    min: [0, 'Coolie amount cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Work date is required']
  },
  days: {
    type: Number,
    required: [true, 'Number of days is required'],
    min: [1, 'Days must be at least 1'],
    default: 1
  }
}, { _id: true })

const paymentEntrySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Payment date is required']
  },
  purpose: {
    type: String,
    required: [true, 'Payment purpose is required'],
    trim: true,
    maxlength: [100, 'Payment purpose cannot exceed 100 characters']
  },
  method: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['Cash', 'PhonePe', 'Bank Transfer', 'UPI', 'Cheque'],
    default: 'Cash'
  }
}, { _id: true })

const cropSchema = new mongoose.Schema({
  farmerAadhar: {
    type: String,
    required: [true, 'Farmer Aadhar is required'],
    ref: 'Farmer',
    match: [/^\d{12}$/, 'Farmer Aadhar must be exactly 12 digits'],
    trim: true,
    index: true
  },
  seedType: {
    type: String,
    required: [true, 'Seed type is required'],
    trim: true,
    maxlength: [100, 'Seed type cannot exceed 100 characters']
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true,
    maxlength: [100, 'Region cannot exceed 100 characters']
  },
  acres: {
    type: Number,
    required: [true, 'Acres is required'],
    min: [0, 'Acres cannot be negative'],
    set: val => parseFloat(val).toFixed(2)
  },
  malePackets: {
    type: Number,
    required: [true, 'Male packets count is required'],
    min: [0, 'Male packets count cannot be negative'],
    integer: true
  },
  femalePackets: {
    type: Number,
    required: [true, 'Female packets count is required'],
    min: [0, 'Female packets count cannot be negative'],
    integer: true
  },
  sowingDateMale: {
    type: Date,
    required: [true, 'Male sowing date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date()
      },
      message: 'Sowing date cannot be in the future'
    }
  },
  sowingDateFemale: {
    type: Date,
    required: [true, 'Female sowing date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date()
      },
      message: 'Sowing date cannot be in the future'
    }
  },
  firstDetachingDate: {
    type: Date,
    required: [true, 'First detaching date is required'],
    validate: {
      validator: function(date) {
        return date >= this.sowingDateMale && date >= this.sowingDateFemale
      },
      message: 'First detaching date must be after sowing dates'
    }
  },
  secondDetachingDate: {
    type: Date,
    required: [true, 'Second detaching date is required'],
    validate: {
      validator: function(date) {
        return date >= this.firstDetachingDate
      },
      message: 'Second detaching date must be after first detaching date'
    }
  },
  harvestingDate: {
    type: Date,
    required: [true, 'Harvesting date is required'],
    validate: {
      validator: function(date) {
        return date >= this.secondDetachingDate
      },
      message: 'Harvesting date must be after second detaching date'
    }
  },
  totalIncome: {
    type: Number,
    required: [true, 'Total income is required'],
    min: [0, 'Total income cannot be negative']
  },
  yield: {
    type: Number,
    required: [true, 'Yield is required'],
    min: [0, 'Yield cannot be negative']
  },
  
  // Array fields for multiple entries
  pesticideEntries: [pesticideEntrySchema],
  coolieEntries: [coolieEntrySchema],
  paymentEntries: [paymentEntrySchema],
  
  // Calculated fields
  totalPesticideCost: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCoolieCost: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPaymentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  netProfit: {
    type: Number,
    default: 0
  },
  
  // Status field
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
})

// Indexes for better query performance
cropSchema.index({ farmerAadhar: 1, createdAt: -1 })
cropSchema.index({ region: 1, status: 1 })
cropSchema.index({ harvestingDate: 1 })
cropSchema.index({ status: 1 })

// Virtual to populate farmer details
cropSchema.virtual('farmer', {
  ref: 'Farmer',
  localField: 'farmerAadhar',
  foreignField: 'aadhar',
  justOne: true
})

// Middleware to calculate totals before saving
cropSchema.pre('save', function(next) {
  // Calculate total pesticide cost
  this.totalPesticideCost = this.pesticideEntries.reduce((total, entry) => {
    return total + (entry.amount || 0)
  }, 0)
  
  // Calculate total coolie cost
  this.totalCoolieCost = this.coolieEntries.reduce((total, entry) => {
    return total + (entry.amount || 0)
  }, 0)
  
  // Calculate total payment amount
  this.totalPaymentAmount = this.paymentEntries.reduce((total, entry) => {
    return total + (entry.amount || 0)
  }, 0)
  
  // Calculate net profit
  this.netProfit = (this.totalIncome || 0) - (this.totalPesticideCost + this.totalCoolieCost + this.totalPaymentAmount)
  
  next()
})

// Instance method to get crop summary
cropSchema.methods.getSummary = function() {
  return {
    farmerAadhar: this.farmerAadhar,
    seedType: this.seedType,
    region: this.region,
    acres: this.acres,
    totalIncome: this.totalIncome,
    totalExpenses: this.totalPesticideCost + this.totalCoolieCost + this.totalPaymentAmount,
    netProfit: this.netProfit,
    yield: this.yield,
    duration: Math.ceil((this.harvestingDate - this.sowingDateMale) / (1000 * 60 * 60 * 24)) + ' days'
  }
}

// Static method to find crops by farmer Aadhar
cropSchema.statics.findByFarmerAadhar = function(aadhar) {
  return this.find({ farmerAadhar: aadhar })
    .populate('farmer')
    .sort({ createdAt: -1 })
}

// Static method to get crop statistics
cropSchema.statics.getCropStats = function(farmerAadhar = null) {
  const matchStage = farmerAadhar ? { $match: { farmerAadhar } } : { $match: {} }
  
  return this.aggregate([
    matchStage,
    {
      $group: {
        _id: null,
        totalCrops: { $sum: 1 },
        totalAcres: { $sum: '$acres' },
        totalIncome: { $sum: '$totalIncome' },
        totalYield: { $sum: '$yield' },
        averageProfit: { $avg: '$netProfit' },
        activeCrops: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        }
      }
    }
  ])
}

// Ensure virtual fields are serialized
cropSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
})

cropSchema.set('toObject', { 
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
})

module.exports = mongoose.model('Crop', cropSchema)