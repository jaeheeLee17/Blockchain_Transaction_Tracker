const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Erc20Token_account_trace_schema = new Schema({
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
  tokenName: {
    type: String,
    required: true,
  },
  tokenSymbol: {
    type: String,
    required: true,
  },
  isUpdated: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})

const Erc20Token_account_traces = mongoose.model('erc20Token_account_traces', Erc20Token_account_trace_schema);

module.exports = Erc20Token_account_traces;