require('dotenv').config();
const Web3 = require('web3');
const ethBlocks = require('../models/ethBlocks');
const ethTransactions = require('../models/ethTransactions');
const ethTokens = require('../models/ethTokens');
const cwr = require('../utils/createWebResponse');
const etherScan = require('etherscan-api').init(
  process.env.ETHERSCAN_API_KEY,
  process.env.ETHERSCAN_NETWORK,
  Number(process.env.QUERY_TIMEOUT),
);
const {StandardABI} = require('../config/eth/standardABI');

const web3 = new Web3(new Web3.providers.HttpProvider(
  process.env.API_URL + process.env.INFURA_PROJECT_ID)
);

// 특정 범위의 거래 블록 정보를 불러온 후 DB에 저장
const getBlockInfo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
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
      message: "Transaction Blocks loading Completed, database updated!",
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'getBlock failed', e.message || e);
  }
}

// 특정 거래 블록에 포함된 거래 정보 불러온 후 DB에 저장
const getTransactionInfo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
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
            "\n-----------------------------------------------");
          await ethTransactions.create({
            blockNumber: transactionInfos.blockNumber,
            transactionHash: blockInfo.transactions[i],
            transactionIndex: transactionInfos.transactionIndex,
            from: transactionInfos.from,
            to: transactionInfos.to,
            value: web3.utils.fromWei(transactionInfos.value, 'ether'),
          });
        }
      }
    }
    return cwr.createWebResp(res, header, 200, {
      message: "Transactions loading Completed, database updated!",
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'getTransaction failed', e.message || e);
  }
}

// 특정 지갑 주소가 포함된 트랜젝션 목록을 불러온 후 DB에 저장
const getTxlistWithAddress = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {walletAddress, startBlockNum, endBlockNum, page, offset, sort, isError} = req.query;
    const txlist = await etherScan.account.txlist(
      walletAddress,
      startBlockNum,
      endBlockNum,
      page,
      offset,
      sort,
    );
    if (isError) {
      const filteredTxlist = txlist.result.reduce((filteredTxlist, tx) => {
        if (tx.isError === isError) {
          filteredTxlist.push(tx);
        }
        return filteredTxlist;
      }, []);
      for (let i = 0; i < filteredTxlist.length; i++) {
        if (filteredTxlist[i].to !== '') {
          console.log("blockNumber: " + filteredTxlist[i].blockNumber,
            "\ntransactionHash: " + filteredTxlist[i].hash,
            "\ntransactionIndex: " + filteredTxlist[i].transactionIndex,
            "\nfrom: " + filteredTxlist[i].from,
            "\nto: " + filteredTxlist[i].to,
            "\nvalue: " + web3.utils.fromWei(String(filteredTxlist[i].value), 'ether'),
            "\n-----------------------------------------------");
          await ethTransactions.create({
            blockNumber: filteredTxlist[i].blockNumber,
            transactionHash: filteredTxlist[i].hash,
            transactionIndex: filteredTxlist[i].transactionIndex,
            from: filteredTxlist[i].from,
            to: filteredTxlist[i].to,
            value: web3.utils.fromWei(String(filteredTxlist[i].value), 'ether'),
          });
        }
      }
      return cwr.createWebResp(res, header, 200, {
        message: "Filtered transaction list loading Completed, database updated!",
      });
    }
    for (let i = 0; i < txlist.result.length; i++) {
      if (txlist.result[i].to !== '') {
        console.log("blockNumber: " + txlist.result[i].blockNumber,
          "\ntransactionHash: " + txlist.result[i].hash,
          "\ntransactionIndex: " + txlist.result[i].transactionIndex,
          "\nfrom: " + txlist.result[i].from,
          "\nto: " + txlist.result[i].to,
          "\nvalue: " + web3.utils.fromWei(String(txlist.result[i].value), 'ether'),
          "\n-----------------------------------------------");
        await ethTransactions.create({
          blockNumber: txlist.result[i].blockNumber,
          transactionHash: txlist.result[i].hash,
          transactionIndex: txlist.result[i].transactionIndex,
          from: txlist.result[i].from,
          to: txlist.result[i].to,
          value: web3.utils.fromWei(String(txlist.result[i].value), 'ether'),
        });
      }
    }
    return cwr.createWebResp(res, header, 200, {
      message: "Transaction list loading Completed, database updated!",
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Transaction list failed', e.message || e);
  }
}

// 특정 지갑 주소의 암호화폐 보유량 조회
const getEtherBalance = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {walletAddress} = req.query;
    let balance = await web3.eth.getBalance(walletAddress);
    balance = web3.utils.fromWei(balance, 'ether');
    const addressCode = await web3.eth.getCode(walletAddress);

    // 계정 유형
    // EOA : 일반 거래에 사용되는 사용자 지갑 주소
    // CA : smart contract 주소
    let addressType;
    if (addressCode !== '0x') {
      addressType = 'CA';
    } else {
      addressType = 'EOA';
    }
    return cwr.createWebResp(res, header, 200, {
      type: addressType,
      balance: balance,
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Ethereum balance failed', e.message || e);
  }
}

// 특정 지갑 주소가 보유한 ERC20 토큰 목록 조회
const getTokenBalanceList = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json')
  try {
    const {walletAddress, contractAddress, startBlockNum=1, endBlockNum='latest', sort='asc'} = req.query;
    const tokenTxList = await etherScan.account.tokentx(
      walletAddress,
      contractAddress,
      startBlockNum,
      endBlockNum,
      sort
    );
    const tokenAddresses = [];
    for (let i = 0; i < tokenTxList.result.length; i++) {
      if (tokenAddresses.includes(tokenTxList.result[i].contractAddress) === false) {
        tokenAddresses.push(tokenTxList.result[i].contractAddress);
      }
    }
    const tokenList = [];
    for (let tokenAddress of tokenAddresses) {
      const contract = new web3.eth.Contract(StandardABI, tokenAddress);
      const unit_convert_num = 10 ** (await contract.methods.decimals().call());
      const tokenBalance = (await contract.methods.balanceOf(walletAddress).call()) / unit_convert_num;
      const tokenName = await contract.methods.name().call();
      const tokenSymbol = await contract.methods.symbol().call();
      const tokenData = {
        name: tokenName,
        balance: tokenBalance,
        symbol: tokenSymbol,
      }
      tokenList.push(tokenData);
    }
    return cwr.createWebResp(res, header, 200, {
      tokens: tokenList,
    })
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get token list failed', e.message || e);
  }
}

// 특정 지갑 주소가 보유한 ERC20 토큰의 거래 목록 조회 후 DB에 저장
const getTokenTxListWithAddress = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json')
  try {
    const {walletAddress, contractAddress, startBlockNum, endBlockNum, sort} = req.query;
    const tokenTxList = await etherScan.account.tokentx(
      walletAddress,
      contractAddress,
      startBlockNum,
      endBlockNum,
      sort
    );
    for (let i = 0; i < tokenTxList.result.length; i++) {
      console.log("blockNumber: " + tokenTxList.result[i].blockNumber,
        "\ntransactionHash: " + tokenTxList.result[i].hash,
        "\ntransactionIndex: " + tokenTxList.result[i].transactionIndex,
        "\ncontractAddress: " + tokenTxList.result[i].contractAddress,
        "\nfrom: " + tokenTxList.result[i].from,
        "\nto: " + tokenTxList.result[i].to,
        "\nvalue: " + web3.utils.fromWei(String(tokenTxList.result[i].value), 'ether'),
        "\ntokenName: " + tokenTxList.result[i].tokenName,
        "\ntokenSymbol: " + tokenTxList.result[i].tokenSymbol,
        "\ntokenNumber: " + tokenTxList.result[i].tokenDecimal,
        "\n-----------------------------------------------");
      await ethTokens.create({
        blockNumber: tokenTxList.result[i].blockNumber,
        transactionHash: tokenTxList.result[i].hash,
        transactionIndex: tokenTxList.result[i].transactionIndex,
        contractAddress: tokenTxList.result[i].contractAddress,
        from: tokenTxList.result[i].from,
        to: tokenTxList.result[i].to,
        value: web3.utils.fromWei(String(tokenTxList.result[i].value), 'ether'),
        tokenName: tokenTxList.result[i].tokenName,
        tokenSymbol: tokenTxList.result[i].tokenSymbol,
        tokenNumber: tokenTxList.result[i].tokenDecimal,
      });
    }
    return cwr.createWebResp(res, header, 200, {
      message: "Token transaction list loading Completed, database updated!",
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get token transaction list failed', e.message || e);
  }
}

module.exports = {
  getBlockInfo,
  getTransactionInfo,
  getTxlistWithAddress,
  getEtherBalance,
  getTokenBalanceList,
  getTokenTxListWithAddress,
};