const express = require('express');
const assetReport = require('./assetReport');
const assetAllocation = require('./assetAllocation');
const assetPerformance = require("./assetPerformance");
const transaction = require("./transaction");

const router = express.Router();

router.use('/assetAllocation', assetAllocation);
router.use('/assetReport', assetReport);
router.use("/assetPerformance", assetPerformance);
router.use("/transaction", transaction);

module.exports = router;