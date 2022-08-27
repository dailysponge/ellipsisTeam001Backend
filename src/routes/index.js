const express = require('express');
const assetReport = require('./assetReport');
const assetAllocation = require('./assetAllocation');


const router = express.Router();

router.use('/assetAllocation', assetAllocation);
router.use('/assetReport', assetReport);


module.exports = router;