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
const postBlockInfo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {startBlockNum, endBlockNum} = req.body;
    const blockNumbers = Array.from({length: Number(endBlockNum) - Number(startBlockNum) + 1},
      (v, i) => Number(startBlockNum) + i);
    const blockInfo = await Promise.all(blockNumbers.map(n => web3.eth.getBlock(n)));
    const filteredBlockInfo = await Promise.all(blockInfo.map(block => {
      if (block.transactions[0] !== null) {
        const blockData = {
          blockNumber: block.number,
          blockHash: block.hash,
          blockSize: block.size,
          parentBlockHash: block.parentHash,
          transactions: block.transactions,
        };
        return blockData;
      }
    }));
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
const postTransactionInfo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {BlockNum} = req.body;
    const blockInfo = await web3.eth.getBlock(BlockNum);
    if (blockInfo.transactions[0] !== null) {
      const transactionsCount = await web3.eth.getBlockTransactionCount(BlockNum);
      const blockNumbers = Array.from({length: transactionsCount}, (v, i) => i);
      const transactionInfos = await Promise.all(blockNumbers.map(n => web3.eth.getTransaction(blockInfo.transactions[n])));
      const filteredTxInfos = await Promise.all(transactionInfos.map(transaction => {
        if (transaction.to !== null) {
          const transactionData = {
            blockNumber: transaction.blockNumber,
            transactionHash: transaction.hash,
            transactionIndex: transaction.transactionIndex,
            from: transaction.from,
            to: transaction.to,
            value: web3.utils.fromWei(String(transaction.value), 'ether'),
          };
          return transactionData;
        }
      }));
      await Promise.all(filteredTxInfos).then((data) => {
        ethTransactions.insertMany(data, {upsert: true}).catch(err => {
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
const postTxlistWithAddress = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {walletAddress, startBlockNum=1, endBlockNum='latest', page, offset, sort='asc'} = req.body;
    const txlist = await etherScan.account.txlist(
      walletAddress,
      startBlockNum,
      endBlockNum,
      page,
      offset,
      sort,
    );
    const selectedTxlist = await Promise.all(txlist.result.map(txReceipt => {
      if (txReceipt.to !== '') {
        const txData = {
          blockNumber: txReceipt.blockNumber,
          transactionHash: txReceipt.hash,
          transactionIndex: txReceipt.transactionIndex,
          from: txReceipt.from,
          to: txReceipt.to,
          value: web3.utils.fromWei(String(txReceipt.value), 'ether'),
        };
        return txData;
      }
    }));
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
    const tokenArr = await Promise.all(tokenTxList.result.map(token => {
      return token.contractAddress;
    }));
    const tokenAddresses = tokenArr.filter((token, index) => {
      return tokenArr.indexOf(token) === index;
    });
    const tokenList = [];
    for (let tokenAddress of tokenAddresses) {
      const contract = new web3.eth.Contract(StandardABI, tokenAddress);
      const unit_convert_num = 10 ** (await contract.methods.decimals().call());
      const tokenBalance = (await contract.methods.balanceOf(walletAddress).call()) / unit_convert_num;
      const tokenName = await contract.methods.name().call();
      const tokenSymbol = await contract.methods.symbol().call();
      const tokenData = {
        name: tokenName,
        balance: tokenBalance.toString(),
        symbol: tokenSymbol.toString(),
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
const postTokenTxListWithAddress = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json')
  try {
    const {walletAddress, contractAddress, startBlockNum=1, endBlockNum='latest', sort='asc'} = req.body;
    const tokenTxList = await etherScan.account.tokentx(
      walletAddress,
      contractAddress,
      startBlockNum,
      endBlockNum,
      sort
    );
    const selectedTokenTx = await Promise.all(tokenTxList.result.map(tokenTxReceipt => {
      if (tokenTxReceipt.to !== '') {
        const tokenTx = {
          blockNumber: tokenTxReceipt.blockNumber,
          transactionHash: tokenTxReceipt.hash,
          transactionIndex: tokenTxReceipt.transactionIndex,
          contractAddress: tokenTxReceipt.contractAddress,
          from: tokenTxReceipt.from,
          to: tokenTxReceipt.to,
          value: web3.utils.fromWei(String(tokenTxReceipt.value), 'ether'),
          tokenName: tokenTxReceipt.tokenName,
          tokenSymbol: tokenTxReceipt.tokenSymbol,
          tokenNumber: tokenTxReceipt.tokenDecimal,
        };
        return tokenTx;
      }
    }))
    await Promise.all(selectedTokenTx).then((data) => {
      ethTokens.insertMany(data, {upsert: true}).catch(err => {
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
  postBlockInfo,
  postTransactionInfo,
  postTxlistWithAddress,
  getEtherBalance,
  getTokenBalanceList,
  postTokenTxListWithAddress,
};