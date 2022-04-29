const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ethBlockSchema = new Schema({
  blockNumber: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Number,
    required: true,
  },
  transactions: {
    type: Number,
    required: true
  },
  network: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const EthBlocks = mongoose.model('ethBlocks', ethBlockSchema)

module.exports = EthBlocks