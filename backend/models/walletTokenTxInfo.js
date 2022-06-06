const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wallet_ERC20_tx_Schema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  network: {
    type: String,
    required: true
  },
  transactionCount: {
    type: Number,
    required: true,
  },
  transactions: [
    {
      transactionHash: {
        type: String,
        required: true
      },
      date: {
        type: Date,
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
      value: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true
})

const wallet_ERC20_tx = mongoose.model('wallet_ERC20Token_transactions', wallet_ERC20_tx_Schema);

module.exports = wallet_ERC20_tx;