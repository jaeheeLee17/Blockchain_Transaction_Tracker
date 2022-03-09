require('dotenv').config();
const Web3 = require('web3');
// const ethBlocks = require('../models/ethBlocks');
const ethTransactions = require('../models/ethTransactions');
const ethTokens = require('../models/ethTokens');
const eth_tx_traces = require('../models/eth_transactions_trace');
const cwr = require('../utils/createWebResponse');
const {StandardABI} = require('../config/eth/standardABI');

// 최신 블록에 포함된 거래 정보들을 불러온 후 DB에 저장
const postTransactionInfo = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {BlockNum='latest'} = req.body;
    const blockInfo = await req.web3.eth.getBlock(BlockNum);
    if (blockInfo.transactions[0] !== null) {
      const transactionsCount = await req.web3.eth.getBlockTransactionCount(BlockNum);
      const blockNumbers = Array.from({length: transactionsCount}, (v, i) => i);
      const transactionInfos = await Promise.all(blockNumbers.map(n => req.web3.eth.getTransaction(blockInfo.transactions[n])));
      const filteredTxInfos = await Promise.all(transactionInfos.map(transaction => {
        if (transaction.to !== null) {
          const transactionData = {
            blockNumber: transaction.blockNumber,
            transactionHash: transaction.hash,
            transactionIndex: transaction.transactionIndex,
            from: transaction.from,
            to: transaction.to,
            value: req.web3.utils.fromWei(String(transaction.value), 'ether'),
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

// 특정 지갑 주소와 관련된 트랜젝션 목록을 불러온 후 DB에 저장
const postTxlistChainWithAddress = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {walletAddress, startBlockNum=1, endBlockNum='latest', page, offset, sort='asc'} = req.body;
    const txlist = await req.etherscan.account.txlist(
      walletAddress,
      startBlockNum,
      endBlockNum,
      page,
      offset,
      sort,
    );

    const selectedTxlist = txlist.result.filter(txReceipt => {
      if (txReceipt.to !== walletAddress.toLowerCase() && txReceipt.to !== '' && txReceipt.to !== undefined
        && txReceipt.value !== '0') {
        return txReceipt;
      }
    });
    const first_depth_tx = await Promise.all(selectedTxlist.map(txReceipt => {
      const txData = {
        tx: txReceipt.hash,
        data: {
          from: txReceipt.from,
          to: txReceipt.to,
          value: req.web3.utils.fromWei(String(txReceipt.value), 'ether')
        }
      };
      return txData;
    }));
    const to_addresses = selectedTxlist.map(txReceipt => {
      if (txReceipt.to !== walletAddress.toLowerCase()) {
        return txReceipt.to;
      } else {
        return '';
      }
    });
    const filtered_to_addresses = to_addresses.filter((addr, idx) => {
      return to_addresses.indexOf(addr) === idx;
    });
    const related_tx = [];
    let address_idx = 0;
    while (address_idx < filtered_to_addresses.length) {
      let address = filtered_to_addresses[address_idx];
      if (address !== "") {
        const relatedTxlist = await req.etherscan.account.txlist(
          address,
          startBlockNum,
          endBlockNum,
          page,
          offset,
          sort,
        );
        const filteredTxlist = relatedTxlist.result.filter(txReceipt => {
          if (txReceipt.to !== address.toLowerCase() && txReceipt.to !== '' && txReceipt.to !== undefined
            && txReceipt.value !== '0') {
            return txReceipt;
          }
        });
        const address_related_Tx = await Promise.all(filteredTxlist.map(relatedTxReceipt => {
          if (relatedTxReceipt.to !== '' && relatedTxReceipt.to !== undefined && relatedTxReceipt.to !== relatedTxReceipt.from &&
            relatedTxReceipt.value !== '0') {
            const txData = {
              tx: relatedTxReceipt.hash,
              data: {
                from: relatedTxReceipt.from,
                to: relatedTxReceipt.to,
                value: req.web3.utils.fromWei(String(relatedTxReceipt.value), 'ether')
              }
            };
            return txData;
          }
        }));
        if (address_related_Tx.length !== 0) {
          related_tx.push(address_related_Tx);
          address_idx++;
        } else {
          const remove_idx = filtered_to_addresses.indexOf(address);
          filtered_to_addresses.splice(remove_idx, 1);
          filtered_to_addresses.length--;
        }
      }
    }
    const txChain = {
      from: walletAddress,
      startBlockNumber: String(startBlockNum),
      endBlockNumber: String(endBlockNum),
      first_depth: first_depth_tx,
      second_depth: related_tx
    };
    eth_tx_traces.insertMany(txChain, {upsert: true}).catch(err => {
      console.log(err);
    });
    return cwr.createWebResp(res, header, 200, {
      message: "Transaction trace list loading Completed, database updated!",
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get Transaction trace list failed', e.message || e);
  }
}

// 특정 지갑 주소의 암호화폐 보유량 조회
const getEtherBalance = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {walletAddress} = req.query;
    let balance = await req.web3.eth.getBalance(walletAddress);
    balance = req.web3.utils.fromWei(balance, 'ether');
    const addressCode = await req.web3.eth.getCode(walletAddress);
    console.log(addressCode);

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
    const tokenTxList = await req.etherscan.account.tokentx(
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
      const contract = new req.web3.eth.Contract(StandardABI, tokenAddress);
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
    const tokenTxList = await req.etherscan.account.tokentx(
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
          value: req.web3.utils.fromWei(String(tokenTxReceipt.value), 'ether'),
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
  // postBlockInfo,
  postTransactionInfo,
  postTxlistChainWithAddress,
  getEtherBalance,
  getTokenBalanceList,
  postTokenTxListWithAddress,
};