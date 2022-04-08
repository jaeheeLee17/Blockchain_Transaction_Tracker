const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ERC20Token_account_trace_schema = new Schema({
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

const ERC20Token_account_traces = mongoose.model('ERC20Token_account_traces', ERC20Token_account_trace_schema);

module.exports = ERC20Token_account_traces;