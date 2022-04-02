const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Eth_account_trace_schema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  startBlockNumber: {
    type: String,
    required: true
  },
  endBlockNumber: {
    type: String,
    required: true
  },
  network: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  isUpdated: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})

const eth_account_traces = mongoose.model('eth_account_traces', Eth_account_trace_schema);

module.exports = eth_account_traces;