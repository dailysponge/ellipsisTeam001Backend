const assetAllocationModel = require('../models/assetAllocation.js');

module.exports = {
    findAssetAllocation: async (userId) => {
        try {
            let userAssetAllocation = await assetAllocationModel
                .findOne({ userId: userId })
                .exec();
            return [undefined, userAssetAllocation];
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
            let assesAllocation = new assetAllocationModel(doc);
            assetAllocation = await assetAllocation.save();
            return [undefined, assetAllocation];
        } catch (error) {
            console.error('Error creating asset allocation', error);
            return [error, null];
        }
    },
    updateAssetAllocation: async (conditions, update) => {
        try {
            const doc = {
                userId,
                amountInvested,
                amountHeld,
                totalValue
            };
            let userAssetAllocation = await assetAllocationModel
                .findOneAndUpdate(conditions, update)
                .exec();
            return [undefined, userAssetAllocation];
        } catch {}
    }
};
