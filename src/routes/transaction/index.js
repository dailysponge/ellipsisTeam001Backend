const express = require('express');
const moment = require('moment');
const { transaction }= require("../../utils")
const router = express.Router();
router.get ("/:userId", async (req, res) => {
    try{
        if (!req.params.userId) {
            throw new Error('Missing parameters');
        }
        const [getTransactionError, userTransaction] = await transaction.getTransaction(
            req.params.userId
        );
        if (getTransactionError) {
            throw new Error(getTransactionError);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                userTransaction
            }
        };
        res.json(response);
    } catch (error) {
        console.error("Error getting user's transaction", error);
        res.status(500).json("Error getting user's transaction");
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.userId || !req.body.deposit) {
            throw new Error('Missing parameters');
        }
        const userId = req.body.userId;
        const deposit = req.body.deposit;
        const [createTransactionError, createTransaction] = await transaction.createTransaction(userId, deposit);
        if (createTransactionError) throw new Error(createTransactionError);

        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                createTransaction
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error creating transaction', error);
        res.status(500).json('Error creating transaction');
    }
});
router.patch('/', async (req, res) => {
    try {
        if (!req.body.userId || !req.body.deposit) {
            throw new Error('Missing parameters');
        }
        const userId = req.body.userId;
        const deposit = req.body.deposit;
        const [updateTransactionError, updateTransaction] = await transaction.updateTransaction(userId, deposit);
        if (updateTransactionError) throw new Error(updateTransactionError);

        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                updateTransaction
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error updating transaction', error);
        res.status(500).json('Error updating transaction');
    }
})
module.exports = router;