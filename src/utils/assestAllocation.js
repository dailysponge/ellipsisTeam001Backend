const assestAllocationModel = require('../models/assestAllocation.js');

module.exports = {
    findAssetAllocation: async (userId) => {
        try {
            let userAssestAllocation = await assestAllocationModel
                .findOne({ userId: userId })
                .exec();
            return [undefined, userAssestAllocation];
        } catch (error) {
            console.error("Error getting user's asset allocation", error);
            return [error, null];
        }
    },
    createAssetAllocation: async (
        userId,
        amountInvested,
        amountHeld,
        totalValue
    ) => {
        try {
            const doc = {
                userId,
                amountInvested,
                amountHeld,
                totalValue
            };
            let assestAllocation = new assestAllocationModel(doc);
            assestAllocation = await assestAllocation.save();
            return [undefined, assestAllocation];
        } catch (error) {
            console.error('Error creating asset allocation', error);
            return [error, null];
        }
    },
    updateAssestAllocation: async (
        userId,
        conditions
    ) => {
        try {
            const doc = {
                userId,
                amountInvested,
                amountHeld,
                totalValue
            };
            let userAssestAllocation = await assestAllocationModel
                .findOneAndUpdate({ userId: userId }, {})
                .exec();
            return [undefined, userAssestAllocation];
        } catch {}
    }
};
