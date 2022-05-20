const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wallet_transactions_schema = new Schema({
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
        required: true,
        unique: true
      },
      blockNum: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
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
      }
    }
  ]
}, {
  timestamps: true
})

const wallet_transactions = mongoose.model('wallet_ETH_transactions', wallet_transactions_schema);

module.exports = wallet_transactions;