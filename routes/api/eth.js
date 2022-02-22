const express = require('express');
const EthController = require('../../controllers/ethereum-network');
const DBController = require('../../controllers/ethereum-mongo');

const router = express.Router();

router.post('/network/block', EthController.getBlockInfo);
router.post('/network/transaction', EthController.getTransactionInfo);
router.post('/network/txlist', EthController.getTxlistWithAddress);
router.post('/network/tokenTxlist', EthController.getTokenTxListWithAddress);

router.get('/network/etherBalance', EthController.getEtherBalance);
router.get('/network/tokenBalanceList', EthController.getTokenBalanceList);
router.get('/db/TxFrom', DBController.getTxFrom);
router.get('/db/TxTo', DBController.getTxTo);
router.get('/db/TokenTxFrom', DBController.getTokenTxFrom);
router.get('/db/TokenTxTo', DBController.getTokenTxTo);

module.exports = router;