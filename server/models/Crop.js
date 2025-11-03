const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Sub-schema for farmer details
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
  farmerDetails: { type: farmerDetailsSchema, required: true },
  seedType: { type: String, trim: true, maxlength: 100 },
  region: { type: String, trim: true, maxlength: 100 },
  acres: { 
    type: Number, 
    min: 0,
    set: (v) => Math.round(parseFloat(v) * 100) / 100  // Proper 2 decimal rounding
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
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },

  // Latest Update Field
  latestUpdate: {
    date: { type: Date },
    type: { type: String },
    description: { type: String }
  }
}, {
  timestamps: true
})

// Indexes
cropSchema.index({ 'farmerDetails.aadhar': 1, createdAt: -1 })
cropSchema.index({ region: 1 })
cropSchema.index({ 'latestUpdate.date': -1 })

// Helper: Check if date is valid and in the past
const isPastDate = (date) => date && date instanceof Date && date <= new Date()

// Pre-save middleware
cropSchema.pre('save', function(next) {
  const now = new Date()
  
  // === Auto-update status based on harvesting date ===
  if (isPastDate(this.harvestingDate)) {
    this.status = 'completed'
  } else if (this.status === 'completed' && !isPastDate(this.harvestingDate)) {
    // If status was completed but harvesting date is in future, revert to active
    this.status = 'active'
  }

  // === Calculate Totals ===
  this.totalPesticideCost = this.pesticideEntries.reduce((sum, e) => sum + (e.amount || 0), 0)
  this.totalCoolieCost = this.coolieEntries.reduce((sum, e) => sum + (e.amount || 0), 0)
  this.totalPaymentAmount = this.paymentEntries.reduce((sum, e) => sum + (e.amount || 0), 0)
  this.netProfit = (this.totalIncome || 0) - (this.totalPesticideCost + this.totalCoolieCost + this.totalPaymentAmount)

  // === Collect All Past Events ===
  const events = []

  // 1. Crop Created (always included)
  events.push({
    date: this.createdAt,
    type: 'created',
    desc: 'Crop record created'
  })

  // 2. Male Sown
  if (isPastDate(this.sowingDateMale)) {
    events.push({
      date: this.sowingDateMale,
      type: 'maleSown',
      desc: 'Male seeds sown'
    })
  }

  // 3. Female Sown
  if (isPastDate(this.sowingDateFemale)) {
    events.push({
      date: this.sowingDateFemale,
      type: 'femaleSown',
      desc: 'Female seeds sown'
    })
  }

  // 4. First Detaching
  if (isPastDate(this.firstDetachingDate)) {
    events.push({
      date: this.firstDetachingDate,
      type: 'detaching',
      desc: 'First detaching done'
    })
  }

  // 5. Second Detaching
  if (isPastDate(this.secondDetachingDate)) {
    events.push({
      date: this.secondDetachingDate,
      type: 'detaching',
      desc: 'Second detaching done'
    })
  }

  // 6. Harvested
  if (isPastDate(this.harvestingDate)) {
    events.push({
      date: this.harvestingDate,
      type: 'harvested',
      desc: 'Crop harvested'
    })
  }

  // 7. Pesticides
  this.pesticideEntries.forEach(entry => {
    if (isPastDate(entry.date)) {
      const qty = entry.quantity != null ? ` - ${entry.quantity}kg` : ''
      events.push({
        date: entry.date,
        type: 'pesticide',
        desc: `Pesticide: ${entry.pesticide}${qty} (₹${entry.amount})`
      })
    }
  })

  // 8. Coolie
  this.coolieEntries.forEach(entry => {
    if (isPastDate(entry.date)) {
      const days = entry.days > 1 ? ` (${entry.days} days)` : ''
      events.push({
        date: entry.date,
        type: 'coolie',
        desc: `Coolie: ${entry.work}${days} (₹${entry.amount})`
      })
    }
  })

  // 9. Payments
  this.paymentEntries.forEach(entry => {
    if (isPastDate(entry.date)) {
      events.push({
        date: entry.date,
        type: 'payment',
        desc: `Payment: ${entry.purpose} - ₹${entry.amount} (${entry.method})`
      })
    }
  })

  // === Find Latest Event ===
  const latest = events
    .filter(e => e.date <= now)
    .sort((a, b) => b.date - a.date)[0]

  // Set latestUpdate
  this.latestUpdate = latest ? {
    date: latest.date,
    type: latest.type,
    description: latest.desc
  } : {
    date: this.createdAt,
    type: 'created',
    description: 'Crop record created'
  }

  next()
})

// Instance method: getSummary
cropSchema.methods.getSummary = function() {
  return {
    id: this._id,
    farmerDetails: this.farmerDetails,
    seedType: this.seedType,
    region: this.region,
    acres: this.acres,
    totalIncome: this.totalIncome,
    totalExpenses: this.totalPesticideCost + this.totalCoolieCost + this.totalPaymentAmount,
    netProfit: this.netProfit,
    yield: this.yield,
    status: this.status,
    latestUpdate: this.latestUpdate,
    duration: this.sowingDateMale && this.harvestingDate
      ? Math.ceil((this.harvestingDate - this.sowingDateMale) / (1000 * 60 * 60 * 24)) + ' days'
      : null
  }
}

// Static: Find by Aadhar
cropSchema.statics.findByFarmerAadhar = function(aadhar) {
  return this.find({ 'farmerDetails.aadhar': aadhar }).lean()
}

// Static: Crop Stats
cropSchema.statics.getCropStats = function(aadhar = null) {
  const match = aadhar ? { 'farmerDetails.aadhar': aadhar } : {}
  return this.aggregate([
    { $match: match },
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

// toJSON transformation
cropSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
})

module.exports = mongoose.model('Crop', cropSchema)