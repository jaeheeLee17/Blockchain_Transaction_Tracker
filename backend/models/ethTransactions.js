const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EthTransactionSchema = new Schema({
  network: {
    type: String,
    required: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
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
  gasPrice: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

const EthTransactions = mongoose.model('ethTransactions', EthTransactionSchema)

module.exports = EthTransactions