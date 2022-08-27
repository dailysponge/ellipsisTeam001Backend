const express = require('express');
const moment = require('moment');
require('dotenv').config();
const router = express.Router();
const { assetAllocation } = require('../../utils');

router.get('/:userId', async (req, res) => {
    try {
        if (!req.params.userId) {
            throw new Error('Missing parameters');
        }

        const [getAssetAllocationError, userAssetAllocation] =
            await assetAllocation.findAssetAllocation({
                userId: req.params.userId
            });
        if (getAssetAllocationError) {
            throw new Error(getAssetAllocationError, conditions);
        }

        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                userAssetAllocation
            }
        };
        res.json(response);
    } catch (error) {
        console.error("Error getting user's asset allocation", error);
        res.status(500).json("Error getting user's asset allocation");
    }
});

router.post('/', async (res, req) => {
    try {
        if (
            !req.body.userId ||
            !req.body.amountInvested ||
            !req.body.amountHeld ||
            !req.body.totalValue
        ) {
            throw new Error('Missing parameters');
        }
        const userId = req.body.userId;
        const amountInvested = req.body.amountInvested;
        const amountHeld = req.body.amountHeld;
        const totalValue = req.body.totalValue;
        const [createAssetAllocationError, userAssetAllocation] =
            await assetAllocation.createAssetAllocation(
                userId,
                amountInvested,
                amountHeld,
                totalValue
            );
        if (createAssetAllocationError) {
            throw new Error(createAssetAllocationError);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                userAssetAllocation
            }
        };
        res.json(response);
    } catch (error) {
        console.error("Error creating user's asset allocation", error);
        res.status(500).json("Error creating user's asset allocation");
    }
});

router.patch('/', async (res, req) => {
    try {
        if (!req.body.userId) {
            throw new Error('Missing parameters');
        }

        const userId = req.body.userId;
        const amountInvested = req.body.amountInvested || undefined;
        const amountHeld = req.body.amountHeld || undefined;
        const totalValue = req.body.totalValue || undefined;

        const update = {};
        const conditions = { userId: userId };
        if (amountInvested) update.amountInvested = amountInvested;
        if (amountHeld) update.amountHeld = amountHeld;
        if (totalValue) update.totalValue = totalValue;

        const [updateAssetAllocationError, userAssetAllocation] =
            await assetAllocation.updateAssetAllocation(
                conditions,
                update
            );
        if (updateAssetAllocationError) {
            throw new Error(updateAssetAllocationError, conditions);
        }

        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                userAssetAllocation
            }
        };
        res.json(response);
    } catch (error) {
        console.error("Error upadating user's asset allocation", error);
        res.status(500).json("Error upadating user's asset allocation");
    }
});
module.exports = router;
