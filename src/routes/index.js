const express = require('express');
const assetAllocation = require('./assetAllocation');

const router = express.Router();

router.use('/assetAllocation', assetAllocation);

module.exports = router;
