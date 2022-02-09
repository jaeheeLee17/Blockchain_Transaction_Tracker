const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ethTokenSchema = new Schema({
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
  contractAddress: {
    type: String,
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
  tokenName: {
    type: String,
    required: true
  },
  tokenSymbol: {
    type: String,
    required: true
  },
  tokenNumber: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})

const EthTokens = mongoose.model('ethtokens', ethTokenSchema)

module.exports = EthTokens