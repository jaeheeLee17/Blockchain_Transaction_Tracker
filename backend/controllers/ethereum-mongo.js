require('dotenv').config();
const ethTransactions = require('../models/ethTransactions');
const ethTokens = require('../models/ethTokens');
const ethCounts = require('../models/ethCounts');
const eth_tx_traces = require('../models/eth_transactions_trace');
const eth_tokentx_traces = require('../models/eth_tokentx_trace');
const eth_account_traces = require('../models/eth_account_trace_req');
const ERC20Token_account_traces = require('../models/erc20Token_account_trace_req');
const cwr = require('../utils/createWebResponse');

// 최근 블록체인 거래 목록 조회
const getLatestTransactions = async (req, res) => {
  try {
    const TransactionData = await ethTransactions.find().sort({blockNumber: -1, transactionIndex: -1})
      .limit(20);
    return cwr.createWebResp(res, header, 200, TransactionData);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get latest Transactions failed', e.message || e);
  }
}

// source에서 시작하는 이더리움 거래 체인 목록 출력
const getTxChainFrom = async (req, res) => {
  try {
    const {source} = req.query;
    const TxChainFromList = await eth_tx_traces.find({"from": source});
    return cwr.createWebResp(res, header, 200, TxChainFromList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Transaction tracking lists with source address failed', e.message || e);
  }
}

const getTokenTxFrom = async (req, res) => {
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
  try {
    const {destination} = req.query;
    const TokenTxFromList = await ethTokens.find({"to": destination});
    return cwr.createWebResp(res, header, 200, TokenTxFromList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Token Transactions with source address failed', e.message || e);
  }
}

// source에서 시작하는 ERC20 토큰 거래 체인 목록 출력
const getTokentxChainFrom = async (req, res) => {
  try {
    const {source} = req.query;
    const TokentxChainFromList = await eth_tokentx_traces.find({"from": source});
    return cwr.createWebResp(res, header, 200, TokentxChainFromList);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Token Transaction trace lists with source address failed', e.message || e);
  }
}

// 특정 지갑 주소의 이더리움 거래 검색 정보 존재 여부 확인
const getEthAccountRecord = async (req, res) => {
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
  try {
    const {walletAddress} = req.query;
    const ERC20TokenAccount = await ERC20Token_account_traces.find({"address": walletAddress});
    return cwr.createWebResp(res, header, 200, ERC20TokenAccount);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get ERC20Token Account Tracking information failed', e.message || e);
  }
}

const ratio = async (req, res) => { //30분 정각 단위로 데이터 끊어서 보내줌.
  try {
    const now = new Date();
    const nowtime = Math.round(now.setDate(now.getDate()) / 1000); //현재 시각
    const before = nowtime-(nowtime % 1800); // 현재 시각에서부터 가장 최근 30분 단위 시간
    const starttime = Math.round(now.setDate(now.getDate() - req.query.setdate)/1000); //설정한 시각
    const beforeday = starttime - (starttime % 1800) //before로부터 하루 전
    let total = 0;
    let list = [];

    console.log(beforeday, before)

    const result = await ethBlocks.aggregate([
      { $match: {timestamp: {$gte: beforeday, $lt: before}}},
      {
        $group: {
          "_id" : "$network",
          "total": {"$sum": "$transactions"}
        }
      }
    ])
    console.log(result);
    for(let i = 0; i <5; i++){
      total += result[i].total;
    }

    for(let j = 0; j < 5; j++){
      list.push({'network': result[j]._id, 'transactions': result[j].total, 'ratio': result[j].total/total})
    }

    return cwr.createWebResp(res, header, 200, list);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'failed', e.message || e);
  }
}

const getEthSupplyCount = async (req, res) => {
  try {
    const ethSupply = await ethCounts.find();
    return cwr.createWebResp(res, header, 200, ethSupply[0]);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'getting the number of ethereum supply failed', e.message || e);
  }
}

module.exports = {
  getLatestTransactions,
  getTxChainFrom,
  getTokenTxFrom,
  getTokentxChainFrom,
  getTokenTxTo,
  getEthAccountRecord,
  getERC20TokenAccountRecord,
  ratio,
  getEthSupplyCount
}