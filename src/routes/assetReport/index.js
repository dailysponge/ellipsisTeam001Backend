const express = require('express');
const moment = require('moment');
require('dotenv').config();
const router = express.Router();
const { assetReport } = require('../../utils');

router.get('/:userId', async (req, res) => {
    try {
        if (!req.params.userId) {
            throw new Error('Missing parameters');
        }

        const [getAssetReportError, userAssetReport] =
            await assetReport.getAssetReport({
                userId: req.params.userId
            });
        if (getAssetReportError) {
            throw new Error(getAssetReportError);
        }

        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                userAssetReport
            }
        };
        res.json(response);
    } catch (error) {
        console.error("Error getting user's asset report", error);
        res.status(500).json("Error getting user's asset report");
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.userId || !req.body.ticker)
            throw new Error('Missing parameters');
        const userId = req.body.userId;
        const ticker = req.body.ticker;
        const [createAssetError, createAsset] = await assetReport.buyAsset(
            userId,
            ticker
        );
        if (createAssetError) throw new Error(createAssetError);
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                createAsset
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error buying asset', error);
        res.status(500).json('Error buying asset');
    }
});
module.exports = router;
