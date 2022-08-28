const express = require('express');
const moment = require('moment');
require('dotenv').config();
const router = express.Router();
const { assetPerformance } = require('../../utils');

function dateConverter(dateObject) {
    let date = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    let year = dateObject.getFullYear();
    return `${year}-${month}-${date}`;
}

router.get('/:userId', async (req, res) => {
    try {
        if (!req.params.userId) {
            throw new Error('Missing parameters');
        }

        const [getUserAssetPerformanceError, userAssetPerformance] =
            await userAssetPerformance.findAssetPerformance({
                userId: req.params.userId
            });
        if (getUserAssetPerformanceError) {
            throw new Error(getUserAssetPerformanceError);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                userAssetPerformance
            }
        };
        res.json(response);
    } catch (error) {
        console.error("Error getting user's asset performance", error);
        res.status(500).json("Error getting user's asset performance");
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.userId) {
            throw new Error('Missing parameters');
        }

        const [createAssetPerformanceError, userAssetPerformance] =
            await assetPerformance.generateAssetPerformanceTable(
                req.body.userId
            );
        if (createAssetPerformanceError) {
            throw new Error(createAssetPerformanceError);
        }
        
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                userAssetPerformance
            }
        };
        res.json(response);
    } catch (error) {
        console.error("Error creating user's asset performance", error);
        res.status(500).json("Error creating user's asset performance");
    }
});

module.exports = router;
