const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Eth_tokentx_trace_schema = new Schema({
  network: {
    type: String,
    required: true
  },
  to: {
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
        tokenName: {
          type: String,
          required: true,
        },
        tokenSymbol: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true
        },
        date: {
          type: Date,
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
          tokenName: {
            type: String,
            required: true,
          },
          tokenSymbol: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true
          },
          date: {
            type: Date,
            required: true
          }
        }
      }
    ]
  ]
}, {
  timestamps: true
})

const eth_tokentx_traces = mongoose.model('eth_tokentx_traces', Eth_tokentx_trace_schema);

module.exports = eth_tokentx_traces;