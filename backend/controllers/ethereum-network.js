require('dotenv').config();
const ethTransactions = require('../models/ethTransactions');
const eth_tx_traces = require('../models/eth_transactions_trace');
const eth_tokentx_traces = require('../models/eth_tokentx_trace');
const eth_account_traces = require('../models/eth_account_trace_req');
const ERC20Token_account_traces = require('../models/erc20Token_account_trace_req');
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

// 이더리움 계정 검색 정보 추가
const postEthAccountTraceRecord = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {walletAddress, startBlockNum, endBlockNum} = req.body;
    const ethtraceCheck = await eth_account_traces.find({"address": walletAddress});
    if (ethtraceCheck.length === 0) {
      const ethTraceRequest = {
        address: walletAddress,
        startBlockNumber: startBlockNum,
        endBlockNumber: endBlockNum,
        network: req.body.endpoint,
        type: 'ethereum',
        isUpdated: false
      };
      eth_account_traces.insertMany(ethTraceRequest, {upsert: true}).catch(err => {
        console.log(err);
      });
      return cwr.createWebResp(res, header, 200, {
        message: "Ethereum Account Record loading Completed, database updated!",
      });
    }
    if (Number(ethtraceCheck[0].startBlockNumber) > Number(startBlockNum)) {
      eth_account_traces.updateMany({"startBlockNumber": ethtraceCheck[0].startBlockNumber},
        {"$set": {"startBlockNumber": startBlockNum, "isUpdated": true}}).catch(err => {
        console.log(err);
      });
    }
    if (Number(ethtraceCheck[0].endBlockNumber) < Number(endBlockNum)) {
      eth_account_traces.updateMany({"endBlockNumber": ethtraceCheck[0].endBlockNumber},
        {"$set": {"endBlockNumber": endBlockNum, "isUpdated": true}}).catch(err => {
        console.log(err);
      });
    }
    return cwr.createWebResp(res, header, 200, {
      message: "Ethereum Account Record updating Completed, database updated!",
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'Adding Ethereum Account Record failed', e.message || e);
  }
}

// ERC20 토큰 계정 검색 정보 추가
const postERC20TokenAccountTraceRecord = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json');
  try {
    const {walletAddress, startBlockNum, endBlockNum} = req.body;
    const ERC20TokenTraceCheck = await ERC20Token_account_traces.find({"address": walletAddress});
    if (ERC20TokenTraceCheck.length === 0) {
      const ERC20TokenTraceRequest = {
        address: walletAddress,
        startBlockNumber: startBlockNum,
        endBlockNumber: endBlockNum,
        network: req.body.endpoint,
        type: 'ERC20Token',
        isUpdated: false
      };
      ERC20Token_account_traces.insertMany(ERC20TokenTraceRequest, {upsert: true}).catch(err => {
        console.log(err);
      });
      return cwr.createWebResp(res, header, 200, {
        message: "ERC20 Token Account Record loading Completed, database updated!",
      });
    }
    if (Number(ERC20TokenTraceCheck[0].startBlockNumber) > Number(startBlockNum)) {
      ERC20Token_account_traces.updateMany({"startBlockNumber": ERC20TokenTraceCheck[0].startBlockNumber},
        {"$set": {"startBlockNumber": startBlockNum, "isUpdated": true}}).catch(err => {
        console.log(err);
      });
    }
    if (Number(ERC20TokenTraceCheck[0].endBlockNumber) < Number(endBlockNum)) {
      ERC20Token_account_traces.updateMany({"endBlockNumber": ERC20TokenTraceCheck[0].endBlockNumber},
        {"$set": {"endBlockNumber": endBlockNum, "isUpdated": true}}).catch(err => {
        console.log(err);
      });
    }
    return cwr.createWebResp(res, header, 200, {
      message: "ERC20 Token Account Record updating Completed, database updated!",
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'Adding ERC20 Token Account Record failed', e.message || e);
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
    // walletAddress를 출발점으로 하는 이더리움 거래가 아닌 목록 제거
    const selectedTxlist = await Promise.all(txlist.result.filter(txReceipt => {
      if (txReceipt.to !== walletAddress.toLowerCase() && txReceipt.to !== '' && txReceipt.to !== undefined
        && txReceipt.value !== '0') {
        return txReceipt;
      }
    }));
    // 목적지가 중복인 거래 목록 필터링
    const uniqueTxlist = await Promise.all(selectedTxlist.filter((addr, idx) => {
      return (
        selectedTxlist.findIndex((addr2, idx) => {
          return addr.to === addr2.to;
        }) === idx
      );
    }));
    const first_depth_tx = await Promise.all(uniqueTxlist.map(txReceipt => {
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
    const to_addresses = uniqueTxlist.map(txReceipt => {
      if (txReceipt.to !== walletAddress.toLowerCase()) {
        return txReceipt.to;
      } else {
        return '';
      }
    });
    const related_tx = [];
    let address_idx = 0;
    while (address_idx < to_addresses.length) {
      let address = to_addresses[address_idx];
      if (address !== "") {
        const relatedTxlist = await req.etherscan.account.txlist(
          address,
          startBlockNum,
          endBlockNum,
          page,
          offset,
          sort,
        );
        const filteredTxlist = await Promise.all(relatedTxlist.result.filter(txReceipt => {
          if (txReceipt.to !== address.toLowerCase() && txReceipt.to !== '' && txReceipt.to !== undefined
            && txReceipt.value !== '0') {
            return txReceipt;
          }
        }));
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
        related_tx.push(address_related_Tx);
        address_idx++;
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
const postTokenTxChainWithAddress = async (req, res) => {
  const header = res.setHeader('Content-Type', 'application/json')
  try {
    const {walletAddress, contractAddress, startBlockNum=1, endBlockNum='latest', sort='asc'} = req.body;
    const tokenTxlist = await req.etherscan.account.tokentx(
      walletAddress,
      contractAddress,
      startBlockNum,
      endBlockNum,
      sort
    );
    // walletAddress를 출발점으로 하는 ERC20 토큰 거래가 아닌 목록 제거
    const selectedTokenTxlist = await Promise.all(tokenTxlist.result.filter(tokentxReceipt => {
      if (tokentxReceipt.to !== walletAddress.toLowerCase() && tokentxReceipt.to !== '' && tokentxReceipt.to !== undefined
      && tokentxReceipt.value !== '0') {
        return tokentxReceipt;
      }
    }));
    const uniqueTokenTxlist = await Promise.all(selectedTokenTxlist.filter((addr, idx) => {
      return (
        selectedTokenTxlist.findIndex((addr2, idx) => {
          return addr.to === addr2.to;
        }) === idx
      );
    }));
    const first_layer_tokentx = await Promise.all(uniqueTokenTxlist.map(tokentxReceipt => {
      const tokentxData = {
        tx: tokentxReceipt.hash,
        data: {
          from: tokentxReceipt.from,
          to: tokentxReceipt.to,
          tokenName: tokentxReceipt.tokenName,
          tokenSymbol: tokentxReceipt.tokenSymbol,
          value: req.web3.utils.fromWei(String(tokentxReceipt.value), 'ether')
        }
      };
      return tokentxData;
    }));
    const token_to_addresses = uniqueTokenTxlist.map(tokentxReceipt => {
      if (tokentxReceipt.to !== walletAddress.toLowerCase()) {
        return tokentxReceipt.to;
      } else {
        return '';
      }
    });
    const related_tokentx = [];
    let address_idx = 0;
    while (address_idx < token_to_addresses.length) {
      let address = token_to_addresses[address_idx];
      if (address !== "") {
        const related_tokenTxlist = await req.etherscan.account.tokentx(
          address,
          contractAddress,
          startBlockNum,
          endBlockNum,
          sort
        );
        const filtered_tokenTxlist = await Promise.all(related_tokenTxlist.result.filter(tokentxReceipt => {
          if (tokentxReceipt.to !== address.toLowerCase() && tokentxReceipt.to !== '' && tokentxReceipt.to !== undefined
          && tokentxReceipt.value !== '0') {
            return tokentxReceipt;
          }
        }));
        const address_related_tokentx = await Promise.all(filtered_tokenTxlist.map(relatedTokenTxReceipt => {
          if (relatedTokenTxReceipt.to !== '' && relatedTokenTxReceipt.to !== undefined &&
            relatedTokenTxReceipt.to !== relatedTokenTxReceipt.from && relatedTokenTxReceipt.value !== '0') {
            const tokentxData = {
              tx: relatedTokenTxReceipt.hash,
              data: {
                from: relatedTokenTxReceipt.from,
                to: relatedTokenTxReceipt.to,
                tokenName: relatedTokenTxReceipt.tokenName,
                tokenSymbol: relatedTokenTxReceipt.tokenSymbol,
                value: req.web3.utils.fromWei(String(relatedTokenTxReceipt.value), 'ether')
              }
            };
            return tokentxData;
          }
        }));
        related_tokentx.push(address_related_tokentx);
        address_idx++;
      }
    }
    const tokentxChain = {
      from: walletAddress,
      startBlockNumber: String(startBlockNum),
      endBlockNumber: String(endBlockNum),
      first_depth: first_layer_tokentx,
      second_depth: related_tokentx
    };
    eth_tokentx_traces.insertMany(tokentxChain, {upsert: true}).catch(err => {
      console.log(err);
    });
    return cwr.createWebResp(res, header, 200, {
      message: "Token transaction trace list loading Completed, database updated!",
    });
  } catch (e) {
    return cwr.errorWebResp(res, header, 500,
      'get token transaction trace list failed', e.message || e);
  }
}

module.exports = {
  postTransactionInfo,
  postEthAccountTraceRecord,
  postERC20TokenAccountTraceRecord,
  postTxlistChainWithAddress,
  getEtherBalance,
  getTokenBalanceList,
  postTokenTxChainWithAddress,
};