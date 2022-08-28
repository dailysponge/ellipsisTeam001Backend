const transactionModel = require('../models/transaction.js');

module.exports = {
    createTransaction: async (userId, deposit) => {
        try {
            let doc = {
                userId,
                deposit
            };
            let transaction = new transactionModel(doc);
            transaction = await transaction.save();
        } catch (error) {
            console.error("Error getting user's asset report", error);
            return [error, null];
        }
    }
};
