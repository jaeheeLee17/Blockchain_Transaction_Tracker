const express = require('express');
const EthController = require('../../controllers/ethereum-network');
const DBController = require('../../controllers/ethereum-mongo');

const router = express.Router();

// router.post('/network/block', EthController.postBlockInfo);
router.post('/network/transaction', EthController.postTransactionInfo);
router.post('/network/txlistchain', EthController.postTxlistChainWithAddress);
router.post('/network/tokenTxlist', EthController.postTokenTxListWithAddress);

router.get('/network/etherBalance', EthController.getEtherBalance);
router.get('/network/tokenBalanceList', EthController.getTokenBalanceList);
router.get('/db/TxFrom', DBController.getTxFrom);
router.get('/db/TxChainFrom', DBController.getTxChainFrom);
router.get('/db/TxTo', DBController.getTxTo);
router.get('/db/TokenTxFrom', DBController.getTokenTxFrom);
router.get('/db/TokenTxTo', DBController.getTokenTxTo);

module.exports = router;