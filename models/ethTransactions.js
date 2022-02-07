const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
  blockNumber: {
    type: Number,
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  transactionIndex: {
    type: Number,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const EthTransactions = mongoose.model('transaction', transactionSchema)

module.exports = EthTransactions