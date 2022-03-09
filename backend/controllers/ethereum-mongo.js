require('dotenv').config();
const ethTransactions = require('../models/ethTransactions');
const ethTokens = require('../models/ethTokens');
const eth_tx_traces = require('../models/eth_transactions_trace');
const cwr = require('../utils/createWebResponse');

const getTxFrom = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {source} = req.query;
    const TxFromList = await ethTransactions.find({"from": source});
    return cwr.createWebResp(res, header, 200, TxFromList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Transactions with source address failed', e.message || e);
  }
}

const getTxChainFrom = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {source} = req.query;
    const TxChainFromList = await eth_tx_traces.find({"from": source});
    return cwr.createWebResp(res, header, 200, TxChainFromList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Transactions with source address failed', e.message || e);
  }
}

const getTxTo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {destination} = req.query;
    const TxToList = await ethTransactions.find({"to": destination});
    return cwr.createWebResp(res, header, 200, TxToList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Transactions with destination address failed', e.message || e);
  }
}

const getTokenTxFrom = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {source} = req.query;
    const TokenTxFromList = await ethTokens.find({"from": source});
    return cwr.createWebResp(res, header, 200, TokenTxFromList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Token Transactions with source address failed', e.message || e);
  }
}

const getTokenTxTo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {destination} = req.query;
    const TokenTxToList = await ethTokens.find({"to": destination});
    return cwr.createWebResp(res, header, 200, TokenTxToList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Token Transactions with destination address failed', e.message || e);
  }
}

module.exports = {
  getTxFrom,
  getTxChainFrom,
  getTxTo,
  getTokenTxFrom,
  getTokenTxTo,
}