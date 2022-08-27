const mongoose = require('mongoose');

const asssetAllocationSchema = new mongoose.Schema(
    {
        userId: { type: Number, required: true },
        amountInvested: { type: Number, required: true },
        amountHeld: { type: Number, required: true},
        totalValue: { type: Number, required: true }
    },
    { timestamps: true }
);

asssetAllocationSchema.index({ userId: 1 });

const assestAllocationModel = mongoose.model('assestAllocation', asssetAllocationSchema);
module.exports = assestAllocationModel;
