const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blockSchema = new Schema({
  blockNumber: {
    type: Number,
    required: true
  },
  blockHash: {
    type: String,
    required: true
  },
  blockSize: {
    type: Number,
    required: true
  },
  parentBlockHash: {
    type: String,
    required: true
  },
  transactionsRoot: {
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

const EthBlocks = mongoose.model('transaction', blockSchema)

module.exports = EthBlocks