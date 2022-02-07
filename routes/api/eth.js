const express = require('express');
const EthController = require('../../controllers/ethereum-network');

const router = express.Router();

router.get('/block', EthController.getBlockInfo);
router.get('/transaction', EthController.getTransactionInfo);

module.exports = router;