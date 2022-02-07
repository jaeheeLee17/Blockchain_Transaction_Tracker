require('dotenv').config();
const Web3 = require('web3');
const ethBlocks = require('../models/ethBlocks');
const ethTransactions = require('../models/ethTransactions');
const cwr = require('../utils/createWebResponse');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.API_URL + process.env.INFURA_PROJECT_ID));

// 특정 범위의 거래 블록 정보를 불러온 후 DB에 저장
const getBlockInfo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json')
  try {
    const {startBlockNum, endBlockNum} = req.query;
    for (let i = startBlockNum; i < endBlockNum; i++) {
      const blockInfo = await web3.eth.getBlock(i);
      if (blockInfo.transactions[0] != null) {
        console.log("blockNumber: " + blockInfo.number,
          "\nblockHash: " + blockInfo.hash,
          "\nblockSize: " + blockInfo.size,
          "\nparentBlockHash: " + blockInfo.parentHash,
          "\ntransactions: " + blockInfo.transactions,
          "\n-----------------------------------------------");
        await ethBlocks.create({
          blockNumber: blockInfo.number,
          blockHash: blockInfo.hash,
          blockSize: blockInfo.size,
          parentBlockHash: blockInfo.parentHash,
          transactions: blockInfo.transactions,
        });
      }
    }
    return cwr.createWebResp(res, header, 200, {
      message: "Transaction Blocks Loading Completed, database updated!"
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500, 'getBlock failed', e.message || e);
  }
}

// 특정 거래 블록에 포함된 거래 정보 불러온 후 DB에 저장
const getTransactionInfo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json')
  try {
    const {BlockNum} = req.query;
    const blockInfo = await web3.eth.getBlock(BlockNum);
    if (blockInfo.transactions[0] != null) {
      const transactionsCount = await web3.eth.getBlockTransactionCount(BlockNum);
      for (let i = 0; i < transactionsCount; i++) {
        const transactionInfos = await web3.eth.getTransaction(blockInfo.transactions[i]);
        if (transactionInfos.to != null) {
          console.log("blockNumber: " + transactionInfos.blockNumber,
            "\ntransactionHash: " + blockInfo.transactions[i],
            "\ntransactionIndex: " + transactionInfos.transactionIndex,
            "\nfrom: " + transactionInfos.from,
            "\nto: " + transactionInfos.to,
            "\nvalue: " + web3.utils.fromWei(transactionInfos.value, 'ether'),
            "\ntype: " + transactionInfos.type,
            "\n-----------------------------------------------");
          await ethTransactions.create({
            blockNumber: transactionInfos.blockNumber,
            transactionHash: blockInfo.transactions[i],
            transactionIndex: transactionInfos.transactionIndex,
            from: transactionInfos.from,
            to: transactionInfos.to,
            value: web3.utils.fromWei(transactionInfos.value, 'ether'),
            type: transactionInfos.type
          });
        }
      }
    }
    return cwr.createWebResp(res, header, 200, {
      message: "Transactions Loading Completed, database updated!"
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500, 'getTransaction failed', e.message || e);
  }
}

module.exports = {
  getBlockInfo,
  getTransactionInfo,
};