const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Wallet_trace_schema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  network: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Wallet_traces = mongoose.model('eth_account_traces', Wallet_trace_schema);

module.exports = Wallet_traces;