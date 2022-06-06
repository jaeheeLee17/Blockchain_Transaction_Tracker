require('dotenv').config();
const ethTransactions = require('../models/ethTransactions');
const ethCounts = require('../models/ethCounts');
const ethBlocks = require('../models/ethBlocks')
const eth_tx_traces = require('../models/eth_transactions_trace');
const eth_tokentx_traces = require('../models/eth_tokentx_trace');
const eth_account_traces = require('../models/eth_account_trace_req');
const ERC20Token_account_traces = require('../models/erc20Token_account_trace_req');
const Wallet_traces = require('../models/wallet_trace_req');
const Wallet_transactions = require('../models/walletTxInfo');
const Wallet_ERC20_tx = require('../models/walletTokenTxInfo');
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

const getETHTransactionsInfo = async (req, res) => {
  try {
    const {walletAddress} = req.query;
    const ETHTxInfos = await Wallet_transactions.find({"address": walletAddress});
    return cwr.createWebResp(res, header, 200, ETHTxInfos[0]);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Token Transactions with source address failed', e.message || e);
  }
}

const getTokenTxInfo = async (req, res) => {
  try {
    const {walletAddress} = req.query;
    const TokenTxInfos = await Wallet_ERC20_tx.find({"address": walletAddress});
    return cwr.createWebResp(res, header, 200, TokenTxInfos[0]);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Token Transactions with source address failed', e.message || e);
  }
}

// source에서 시작하는 이더리움 거래 체인 목록 출력
const getTxChainFrom = async (req, res) => {
  try {
    const {source} = req.query;
    const TxChainFromList = await eth_tx_traces.find({"from": source.toLowerCase()});

    if (TxChainFromList.length !== 0) {
      const second = TxChainFromList[0]["second_depth"];
      const uniqueArrforsecond = [];

      for(let i = 0; i < second.length; i++) {
        second[i].forEach(element => {
          if (!uniqueArrforsecond.some(v => v.from === element["data"]["from"] && v.to === element["data"]["to"])) {
            uniqueArrforsecond.push(
              {from: element["data"]["from"],
                to: element["data"]["to"],
                value: element["data"]["value"],
                recentDate: element["data"]["date"],
                tx: [element["second_tx"]],
                count: 1});
          }
          else{
            let index = uniqueArrforsecond.indexOf(uniqueArrforsecond.find(v => v.from === element["data"]["from"] && v.to === element["data"]["to"]))
            uniqueArrforsecond[index].value = uniqueArrforsecond[index].value*1 + element["data"]["value"]*1;
            uniqueArrforsecond[index].count += 1;
            uniqueArrforsecond[index].tx.push(element["second_tx"])
          }
        })
      }

      const result = {
        network: TxChainFromList[0].network,
        from: TxChainFromList[0].from,
        startBlockNumber: TxChainFromList[0].startBlockNumber,
        endBlockNumber: TxChainFromList[0].endBlockNumber,
        first_depth: TxChainFromList[0].first_depth,
        second_depth: uniqueArrforsecond
      }

      return cwr.createWebResp(res, header, 200, result);
    } else {
      return cwr.createWebResp(res, header, 200, []);
    }
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Transaction tracking lists with source address failed', e.message || e);
  }
}

// Destination에서 끝나는 ERC20 토큰 거래 체인 목록 출력
const getTokentxChainTo = async (req, res) => {
  try {
    const {destination} = req.query;
    const TokentxChainFromList = await eth_tokentx_traces.find({"to": destination.toLowerCase()});

    if (TokentxChainFromList.length !== 0) {
      const second = TokentxChainFromList[0]["second_depth"];
      const uniqueArrforsecond = [];

      for(let i = 0; i < second.length; i++) {
        second[i].forEach(element => {
          if (!uniqueArrforsecond.some(v => v.from === element["data"]["from"] && v.to === element["data"]["to"] && v.tokenName === element["data"]["tokenName"])) {
            uniqueArrforsecond.push(
              {from: element["data"]["from"],
                to: element["data"]["to"],
                value: element["data"]["value"],
                recentDate: element["data"]["date"],
                tokenSymbol: element["data"]["tokenSymbol"],
                tokenName: element["data"]["tokenName"],
                tx: [element["second_tx"]],
                count: 1});
          }
          else{
            let index = uniqueArrforsecond.indexOf(uniqueArrforsecond.find(v => v.from === element["data"]["from"] && v.to === element["data"]["to"]))
            uniqueArrforsecond[index].value = uniqueArrforsecond[index].value*1 + element["data"]["value"]*1;
            uniqueArrforsecond[index].count += 1;
            uniqueArrforsecond[index].tx.push(element["second_tx"])
          }
        })
      }

      const result = {
        network: TokentxChainFromList[0].network,
        to: TokentxChainFromList[0].to,
        startBlockNumber: TokentxChainFromList[0].startBlockNumber,
        endBlockNumber: TokentxChainFromList[0].endBlockNumber,
        first_depth: TokentxChainFromList[0].first_depth,
        second_depth: uniqueArrforsecond
      }

      return cwr.createWebResp(res, header, 200, result);
    }
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
    return cwr.createWebResp(res, header, 200, ethAccount[0]);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Ethereum Account Record failed', e.message || e);
  }
}

// 특정 지갑 주소의 ERC20 토큰 거래 검색 정보 존재 여부 확인
const getERC20TokenAccountRecord = async (req, res) => {
  try {
    const {walletAddress} = req.query;
    const ERC20TokenAccount = await ERC20Token_account_traces.find({"address": walletAddress});
    return cwr.createWebResp(res, header, 200, ERC20TokenAccount[0]);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get ERC20Token Account Tracking information failed', e.message || e);
  }
}

// 특정 지갑 주소 검색 정보 존재 여부 확인
const getWalletRecord = async (req, res) => {
  try {
    const {walletAddress} = req.query;
    const Wallet = await Wallet_traces.find({"address": walletAddress});
    return cwr.createWebResp(res, header, 200, Wallet[0]);
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Wallet Record failed', e.message || e);
  }
}

const getTransactionsPerHour = async (req, res) => { //시간별 트랜잭션 생성량
  try {
    const now = new Date();
    const nowtime = Math.round(now.setDate(now.getDate()) / 1000);
    let hourbefore = nowtime-(nowtime % 3600);
    const resultarr = []

    for(let i = 0; i < req.query.sethour; i++)
    {
      let result = await ethBlocks.aggregate([
        {$match: {timestamp: {$gte: hourbefore - 3600, $lt: hourbefore}}},
        {
          $group: {
            "_id": "$network",
            "transactions": {"$sum": "$transactions"}
          }
        }
      ])
      hourbefore = hourbefore - 3600;
      result[0].endtime = new Date(1000*hourbefore)
      result[0].starttime = new Date(1000*(hourbefore-3600))
      resultarr.push(result[0])
    }

    return cwr.createWebResp(res, header, 200, resultarr);
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
  getETHTransactionsInfo,
  getTokenTxInfo,
  getTxChainFrom,
  getTokentxChainTo,
  getEthAccountRecord,
  getERC20TokenAccountRecord,
  getWalletRecord,
  getTransactionsPerHour,
  getEthSupplyCount
}