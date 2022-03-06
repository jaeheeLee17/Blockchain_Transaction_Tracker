const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EthTransactionSchema = new Schema({
  blockNumber: {
    type: Number,
    required: true
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true,
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
}, {
  timestamps: true
})

const EthTransactions = mongoose.model('ethTransactions', EthTransactionSchema)

module.exports = EthTransactions