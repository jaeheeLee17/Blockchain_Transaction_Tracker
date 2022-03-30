require('dotenv').config();
const ethTransactions = require('../models/ethTransactions');
const ethTokens = require('../models/ethTokens');
const eth_tx_traces = require('../models/eth_transactions_trace');
const eth_tokentx_traces = require('../models/eth_tokentx_trace');
const eth_account_traces = require('../models/eth_account_trace_req');
const ERC20Token_account_traces = require('../models/erc20Token_account_trace_req');
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
// source에서 시작하는 이더리움 거래 체인 목록 출력
const getTxChainFrom = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {source} = req.query;
    const TxChainFromList = await eth_tx_traces.find({"from": source});
    return cwr.createWebResp(res, header, 200, TxChainFromList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Transaction tracking lists with source address failed', e.message || e);
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
// source에서 시작하는 ERC20 토큰 거래 체인 목록 출력
const getTokentxChainFrom = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {source} = req.query;
    const TokentxChainFromList = await eth_tokentx_traces.find({"from": source});
    return cwr.createWebResp(res, header, 200, TokentxChainFromList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Token Transaction trace lists with source address failed', e.message || e);
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

// 특정 지갑 주소의 이더리움 거래 검색 정보 존재 여부 확인
const getEthAccountRecord = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {walletAddress} = req.query;
    const ethAccount = await eth_account_traces.find({"address": walletAddress});
    return cwr.createWebResp(res, header, 200, ethAccount);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Ethereum Account Tracking information failed', e.message || e);
  }
}

// 특정 지갑 주소의 ERC20 토큰 거래 검색 정보 존재 여부 확인
const getERC20TokenAccountRecord = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {walletAddress} = req.query;
    const ERC20TokenAccount = await ERC20Token_account_traces.find({"address": walletAddress});
    return cwr.createWebResp(res, header, 200, ERC20TokenAccount);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get ERC20Token Account Tracking information failed', e.message || e);
  }
}

module.exports = {
  getTxFrom,
  getTxChainFrom,
  getTxTo,
  getTokenTxFrom,
  getTokentxChainFrom,
  getTokenTxTo,
  getEthAccountRecord,
  getERC20TokenAccountRecord,
}