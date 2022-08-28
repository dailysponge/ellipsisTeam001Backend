const transactionModel = require('../models/transaction.js');

module.exports = {
    createTransaction: async (userId) => {
        try {
            
        } catch(error) {
            console.error("Error getting user's asset report", error);
            return [error, null];
        }
    }
}