const express = require('express');
const EthController = require('../../controllers/ethereum-network');
const DBController = require('../../controllers/ethereum-mongo');
const mw = require('../../controllers/middleware')

const router = express.Router();

router.post('/network/transaction', mw.web3, EthController.postTransactionInfo);
router.post('/network/ethAccountTrace', mw.etherscan, mw.web3, EthController.postEthAccountTraceRecord);
router.post('/network/ERC20TokenAccountTrace', mw.etherscan, mw.web3, EthController.postERC20TokenAccountTraceRecord);
router.post('/network/WalletTrace', mw.etherscan, mw.web3, EthController.postWalletTraceRecord);
router.post('/network/txlistchain', mw.etherscan, mw.web3, EthController.postTxlistChainWithAddress);
router.post('/network/tokenTxlistchain', mw.etherscan, mw.web3, EthController.postTokenTxChainWithAddress);
router.post('/network/postblockinfo', mw.etherscan, mw.web3, EthController.postBlockInfo);
router.post('/network/ETHTxlist', mw.etherscan, mw.web3, EthController.postETHTxInfoWithAddress);
router.post('/network/tokentxlist', mw.etherscan, mw.web3, EthController.postTokenTxInfoWithAddress);
router.post('/network/ethCount', mw.etherscan, EthController.postEthSupplyCount);

router.get('/network/ethPrice', mw.etherscan, EthController.getLatestEtherPrice);
router.get('/network/gasPriceStats', EthController.getGasPriceStats);
router.get('/network/etherBalance', mw.web3, EthController.getEtherBalance);
router.get('/network/tokenBalanceList', mw.etherscan, mw.web3, EthController.getTokenBalanceList);
router.get('/network/getTransactionInfo', mw.web3, EthController.getTransactionInfo);
router.get('/db/latestTransaction', DBController.getLatestTransactions);
router.get('/db/TxChainFrom', DBController.getTxChainFrom);
router.get('/db/ETHTxInfo', DBController.getETHTransactionsInfo);
router.get('/db/TokenTxInfo', DBController.getTokenTxInfo);
router.get('/db/TokentxChainTo', DBController.getTokentxChainTo);
router.get('/db/ethAccountTrace', DBController.getEthAccountRecord);
router.get('/db/ERC20TokenAccountTrace', DBController.getERC20TokenAccountRecord);
router.get('/db/WalletTrace', DBController.getWalletRecord);
router.get('/db/getTransactionsPerHour', DBController.getTransactionsPerHour);
router.get('/db/ethCount', DBController.getEthSupplyCount);

module.exports = router;
