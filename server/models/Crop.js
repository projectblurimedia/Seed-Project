const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Sub-schema for farmer details (embedded)
const farmerDetailsSchema = new Schema({
  firstName: { type: String, trim: true, maxlength: 50 },
  lastName: { type: String, trim: true, maxlength: 50 },
  aadhar: {
    type: String,
    required: [true, 'Farmer Aadhar is required'],
    match: [/^\d{12}$/, 'Aadhar number must be exactly 12 digits'],
    trim: true
  },
  mobile: { type: String, match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits'], trim: true },
  bankAccountNumber: { type: String, match: [/^\d{9,18}$/, 'Bank account number must be between 9 and 18 digits'], trim: true },
  village: { type: String, trim: true, maxlength: 100 }
})

// Sub-schemas for arrays
const pesticideEntrySchema = new Schema({
  pesticide: { type: String, trim: true, maxlength: 100 },
  quantity: { type: Number, min: 0 },
  amount: { type: Number, min: 0 },
  date: { type: Date }
}, { _id: true })

const coolieEntrySchema = new Schema({
  work: { type: String, trim: true, maxlength: 100 },
  count: { type: Number, min: 0 },
  amount: { type: Number, min: 0 },
  date: { type: Date },
  days: { type: Number, min: 1, default: 1 }
}, { _id: true })

const paymentEntrySchema = new Schema({
  amount: { type: Number, min: 0 },
  date: { type: Date },
  purpose: { type: String, trim: true, maxlength: 100 },
  method: { type: String, enum: ['Cash', 'PhonePe', 'Bank Transfer', 'UPI', 'Cheque'], default: 'Cash' }
}, { _id: true })

// Main Crop Schema
const cropSchema = new Schema({
  farmerDetails: { type: farmerDetailsSchema, required: [true, 'Farmer details are required'] },
  seedType: { type: String, trim: true, maxlength: 100 },
  region: { type: String, trim: true, maxlength: 100 },
  acres: { 
    type: Number, 
    min: 0, 
    set: val => parseFloat(val).toFixed(2) 
  },
  malePackets: {
    type: Number,
    min: 0,
    validate: { validator: Number.isInteger, message: 'Male packets must be an integer' }
  },
  femalePackets: {
    type: Number,
    min: 0,
    validate: { validator: Number.isInteger, message: 'Female packets must be an integer' }
  },
  sowingDateMale: { type: Date },
  sowingDateFemale: { type: Date },
  firstDetachingDate: { type: Date },
  secondDetachingDate: { type: Date },
  harvestingDate: { type: Date },
  totalIncome: { type: Number, min: 0 },
  yield: { type: Number, min: 0 },
  pesticideEntries: [pesticideEntrySchema],
  coolieEntries: [coolieEntrySchema],
  paymentEntries: [paymentEntrySchema],
  totalPesticideCost: { type: Number, default: 0, min: 0 },
  totalCoolieCost: { type: Number, default: 0, min: 0 },
  totalPaymentAmount: { type: Number, default: 0, min: 0 },
  netProfit: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' }
}, {
  timestamps: true
})

// Indexes
cropSchema.index({ 'farmerDetails.aadhar': 1, createdAt: -1 })
cropSchema.index({ region: 1 })

// Pre-save middleware for calculations
cropSchema.pre('save', function(next) {
  this.totalPesticideCost = this.pesticideEntries.reduce((total, entry) => total + (entry.amount || 0), 0)
  this.totalCoolieCost = this.coolieEntries.reduce((total, entry) => total + (entry.amount || 0), 0)
  this.totalPaymentAmount = this.paymentEntries.reduce((total, entry) => total + (entry.amount || 0), 0)
  this.netProfit = (this.totalIncome || 0) - (this.totalPesticideCost + this.totalCoolieCost + this.totalPaymentAmount)
  next()
})

// Instance method: Summary
cropSchema.methods.getSummary = function() {
  return {
    id: this._id,
    farmerDetails: this.farmerDetails,
    seedType: this.seedType,
    region: this.region,
    acres: this.acres,
    totalIncome: this.totalIncome,
    totalExpenses: (this.totalPesticideCost || 0) + (this.totalCoolieCost || 0) + (this.totalPaymentAmount || 0),
    netProfit: this.netProfit,
    yield: this.yield,
    duration: this.sowingDateMale && this.harvestingDate 
      ? Math.ceil((this.harvestingDate - this.sowingDateMale) / (1000 * 60 * 60 * 24)) + ' days' 
      : null
  }
}

// Static method: Find by farmer Aadhar
cropSchema.statics.findByFarmerAadhar = function(aadhar) {
  return this.find({ 'farmerDetails.aadhar': aadhar }).lean()
}

// Static method: Crop stats
cropSchema.statics.getCropStats = function(aadhar = null) {
  const matchStage = aadhar ? { $match: { 'farmerDetails.aadhar': aadhar } } : { $match: {} }
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
        activeCrops: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } }
      }
    }
  ])
}

// Serialization
cropSchema.set('toJSON', { virtuals: true, transform: (doc, ret) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
  return ret
}})

module.exports = mongoose.model('Crop', cropSchema)