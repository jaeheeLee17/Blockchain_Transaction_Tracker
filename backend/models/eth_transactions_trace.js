const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Eth_tx_trace_schema = new Schema({
  from: {
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
  first_depth: [
    {
      tx: {
        type: String,
        required: true,
        unique: true
      },
      data: {
        from: {
          type: String,
          required: true
        },
        to: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true
        }
      }
    }
  ],
  second_depth: [
    [
      {
        tx: {
          type: String,
          required: true,
          unique: true
        },
        data: {
          from: {
            type: String,
            required: true
          },
          to: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true
          }
        }
      }
    ]
  ]
}, {
  timestamps: true
})

const eth_tx_traces = mongoose.model('eth_tx_traces', Eth_tx_trace_schema);

module.exports = eth_tx_traces;