const express = require('express');
const assetReport = require('./assetReport');
const assetAllocation = require('./assetAllocation');
const assetPerformance = require("./assetPerformance");

const router = express.Router();

router.use('/assetAllocation', assetAllocation);
router.use('/assetReport', assetReport);
router.use("/assetPerformance", assetPerformance);

module.exports = router;