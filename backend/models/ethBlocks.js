const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ethBlockSchema = new Schema({
  blockNumber: {
    type: Number,
    required: true
  },
  blockHash: {
    type: String,
    required: true,
    unique: true
  },
  blockSize: {
    type: Number,
    required: true
  },
  parentBlockHash: {
    type: String,
    required: true
  },
  transactions: {
    type: Array,
    required: true
  },
}, {
  timestamps: true
})

const EthBlocks = mongoose.model('ethBlocks', ethBlockSchema)

module.exports = EthBlocks