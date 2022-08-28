const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userId: { type: Number, required: true },
        deposit: { type: Number, required: true }
    },
    { timestamps: true }
);

transactionSchema.index({ userId: 1 });

const transactionModel = mongoose.model('transaction', transactionSchema);
module.exports = transactionModel;
