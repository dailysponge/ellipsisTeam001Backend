const mongoose = require('mongoose');

const assetAllocationSchema = new mongoose.Schema(
    {
        userId: { type: Number, required: true },
        amountInvested: { type: Number, required: true },
        amountHeld: { type: Number, required: true}
    },
    { timestamps: true }
);

assetAllocationSchema.index({ userId: 1 });

const assetAllocationModel = mongoose.model('assetAllocation', assetAllocationSchema);
module.exports = assetAllocationModel;
