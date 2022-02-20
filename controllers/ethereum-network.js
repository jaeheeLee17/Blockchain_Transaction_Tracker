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

// low부터 high까지 숫자 배열 생성
function _range(low, high) {
  let numberArray = [];
  for (let i = low; i < high; i++) {
    numberArray.push(i);
  }
  return numberArray;
}

// 특정 개수의 최신 거래 블록 정보를 불러온 후 DB에 저장
const getBlockInfo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {searchNum} = req.query;
    const latestBlockNum = await web3.eth.getBlockNumber();
    const blockNumbers = _range(latestBlockNum - searchNum + 1, latestBlockNum + 1);
    const blockInfo = await Promise.all(blockNumbers.map(n => web3.eth.getBlock(n)));
    const filteredBlockInfo = [];
    for (let i = 0; i < blockInfo.length; i++) {
      if (blockInfo[i].transactions[0] !== null) {
        const blockData = {
          blockNumber: blockInfo[i].number,
          blockHash: blockInfo[i].hash,
          blockSize: blockInfo[i].size,
          parentBlockHash: blockInfo[i].parentHash,
          transactions: blockInfo[i].transactions,
        }
        filteredBlockInfo.push(blockData);
      }
    }
    await Promise.all(filteredBlockInfo).then((data) => {
      ethBlocks.insertMany(data, {upsert: true}).catch(err => {
        console.log(err);
      });
    });
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
    if (blockInfo.transactions[0] !== null) {
      const transactionsCount = await web3.eth.getBlockTransactionCount(BlockNum);
      const blockNumbers = _range(0, transactionsCount);
      const transactionInfos = await Promise.all(blockNumbers.map(n => web3.eth.getTransaction(blockInfo.transactions[n])));
      const filteredTxInfos = [];
      for (let i = 0; i < transactionInfos.length; i++) {
        if (transactionInfos[i].to !== null) {
          const transactionData = {
            blockNumber: transactionInfos[i].blockNumber,
            transactionHash: transactionInfos[i].hash,
            transactionIndex: transactionInfos[i].transactionIndex,
            from: transactionInfos[i].from,
            to: transactionInfos[i].to,
            value: web3.utils.fromWei(String(transactionInfos[i].value), 'ether'),
          }
          filteredTxInfos.push(transactionData);
        }
      }
      await Promise.all(filteredTxInfos).then((data) => {
        ethBlocks.insertMany(data, {upsert: true}).catch(err => {
          console.log(err);
        });
      });
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
    const {walletAddress, startBlockNum=1, endBlockNum='latest', page, offset, sort='asc', isError} = req.query;
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
      const selectedTxlist = [];
      for (let i = 0; i < filteredTxlist.length; i++) {
        if (filteredTxlist[i].to !== '') {
          const txData = {
            blockNumber: filteredTxlist[i].blockNumber,
            transactionHash: filteredTxlist[i].hash,
            transactionIndex: filteredTxlist[i].transactionIndex,
            from: filteredTxlist[i].from,
            to: filteredTxlist[i].to,
            value: web3.utils.fromWei(String(filteredTxlist[i].value), 'ether'),
          };
          selectedTxlist.push(txData);
        }
      }
      await Promise.all(selectedTxlist).then((data) => {
        ethTransactions.insertMany(data, {upsert: true}).catch(err => {
          console.log(err);
        });
      });
      return cwr.createWebResp(res, header, 200, {
        message: "Filtered transaction list loading Completed, database updated!",
      });
    }
    const selectedTxlist = [];
    for (let i = 0; i < txlist.result.length; i++) {
      if (txlist.result[i].to !== '') {
        const txData = {
          blockNumber: txlist.result[i].blockNumber,
          transactionHash: txlist.result[i].hash,
          transactionIndex: txlist.result[i].transactionIndex,
          from: txlist.result[i].from,
          to: txlist.result[i].to,
          value: web3.utils.fromWei(String(txlist.result[i].value), 'ether'),
        };
        selectedTxlist.push(txData);
      }
    }
    await Promise.all(selectedTxlist).then((data) => {
      ethTransactions.insertMany(data, {upsert: true}).catch(err => {
        console.log(err);
      });
    })
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
    const {walletAddress, contractAddress, startBlockNum=1, endBlockNum='latest', sort='asc'} = req.query;
    const tokenTxList = await etherScan.account.tokentx(
      walletAddress,
      contractAddress,
      startBlockNum,
      endBlockNum,
      sort
    );
    const selectedTokenTx = [];
    for (let i = 0; i < tokenTxList.result.length; i++) {
      if (tokenTxList.result.to !== '') {
        const tokenTx = {
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
        };
        selectedTokenTx.push(tokenTx);
      }
    }
    await Promise.all(selectedTokenTx).then((data) => {
      ethBlocks.insertMany(data, {upsert: true}).catch(err => {
        console.log(err);
      });
    })
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