const express = require('express');
const EthController = require('../../controllers/ethereum-network');

const router = express.Router();

router.get('/block', EthController.getBlockInfo);
router.get('/transaction', EthController.getTransactionInfo);
router.get('/txlist', EthController.getTxlistWithAddress);
router.get('/tokenTxlist', EthController.getTokenTxListWithAddress);
router.get('/etherBalance', EthController.getEtherBalance);
router.get('/tokenBalanceList', EthController.getTokenBalanceList);

module.exports = router;