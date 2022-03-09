const express = require('express');
const EthController = require('../../controllers/ethereum-network');
const DBController = require('../../controllers/ethereum-mongo');
const mw = require('../../controllers/middleware')

const router = express.Router();

// router.post('/network/block', EthController.postBlockInfo);
router.post('/network/transaction', mw.web3, EthController.postTransactionInfo);
router.post('/network/txlistchain', mw.etherscan, mw.web3, EthController.postTxlistChainWithAddress);
router.post('/network/tokenTxlist', mw.etherscan, mw.web3, EthController.postTokenTxListWithAddress);

router.get('/network/etherBalance', mw.web3, EthController.getEtherBalance);
router.get('/network/tokenBalanceList', mw.etherscan, mw.web3, EthController.getTokenBalanceList);

router.get('/db/TxFrom', DBController.getTxFrom);
router.get('/db/TxChainFrom', DBController.getTxChainFrom);
router.get('/db/TxTo', DBController.getTxTo);
router.get('/db/TokenTxFrom', DBController.getTokenTxFrom);
router.get('/db/TokenTxTo', DBController.getTokenTxTo);

module.exports = router;
