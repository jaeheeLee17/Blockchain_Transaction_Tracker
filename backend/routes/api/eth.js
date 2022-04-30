const express = require('express');
const EthController = require('../../controllers/ethereum-network');
const DBController = require('../../controllers/ethereum-mongo');
const mw = require('../../controllers/middleware')

const router = express.Router();

router.post('/network/transaction', mw.web3, EthController.postTransactionInfo);
router.post('/network/ethAccountTrace', mw.etherscan, mw.web3, EthController.postEthAccountTraceRecord);
router.post('/network/ERC20TokenAccountTrace', mw.etherscan, mw.web3, EthController.postERC20TokenAccountTraceRecord);
router.post('/network/txlistchain', mw.etherscan, mw.web3, EthController.postTxlistChainWithAddress);
router.post('/network/tokenTxlistchain', mw.etherscan, mw.web3, EthController.postTokenTxChainWithAddress);
router.post('/network/postblockinfo', mw.etherscan, mw.web3, EthController.postBlockInfo);

router.get('/network/ethPrice', mw.etherscan, EthController.getLatestEtherPrice);
router.get('/network/ethCount', mw.etherscan, EthController.getEthSupplyCount);
router.get('/network/etherBalance', mw.web3, EthController.getEtherBalance);
router.get('/network/tokenBalanceList', mw.etherscan, mw.web3, EthController.getTokenBalanceList);

router.get('/db/latestTransaction', DBController.getLatestTransactions);
router.get('/db/TxChainFrom', DBController.getTxChainFrom);
router.get('/db/TokenTxFrom', DBController.getTokenTxFrom);
router.get('/db/TokentxChainFrom', DBController.getTokentxChainFrom);
router.get('/db/TokenTxTo', DBController.getTokenTxTo);
router.get('/db/ethAccountTrace', DBController.getEthAccountRecord);
router.get('/db/ERC20TokenAccountTrace', DBController.getERC20TokenAccountRecord);
router.get('/db/ratio', DBController.ratio);

module.exports = router;
