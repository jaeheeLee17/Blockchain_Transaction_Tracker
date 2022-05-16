const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ethCountSchema = new Schema({
  ethCount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const EthCounts = mongoose.model('ethCounts', ethCountSchema)

module.exports = EthCounts