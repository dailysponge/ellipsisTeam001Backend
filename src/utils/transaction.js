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
            return [null, transaction];
        } catch (error) {
            console.error("Error getting user's asset report", error);
            return [error, null];
        }
    },
    updateTransaction: async (userId,amount) => {
        try{
            const transaction = await transactionModel.findOneAndUpdate({userId}, {$inc: {deposit: amount} }, {new:true}).exec();
            return [undefined, transaction];
        } catch (error) {
            console.error("Error getting user's asset report", error);
            return [error, null];
        }
    }
};
