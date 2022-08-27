const assetAllocationModel = require('../models/assetAllocation.js');
const assetReportModel = require('../models/assetReport.js');
const { getPrice } = require('./assetReport');

module.exports = {
    // only getting current asset allocation
    // getAssetAllocation: async (conditions) => {
    //     try {
    //         let assetAllocation = await assetAllocationModel
    //             .findOne(conditions)
    //             .exec();
    //         return [null, assetAllocation];
    //     } catch (error) {
    //         console.error("Error getting user's asset allocation", error);
    //         return [error, null];
    //     }
    // },

    // for the generation of the homepage
    findAssetAllocation: async (conditions) => {
        try {
            const userId = conditions.userId;
            let userAssetAllocation = await assetAllocationModel
                .find(conditions)
                .exec();
            let amountHeld = userAssetAllocation[0].amountHeld;

            let userAssetReport = await assetReportModel
                .find(conditions)
                .exec();
            let totalInvested = 0;
            // updating the stock price for each row in the table
            for (asset of userAssetReport) {
                const ticker = asset.companyTicker;
                const assetData = await getPrice(ticker);
                const numberOfStocks = asset.numberOfStocks;
                const stockPrice = assetData[0].price; // realtime stock price
                totalInvested += stockPrice * numberOfStocks;
                // Also update the record table at the same time to save resources :(
                let newUserReport = await assetReportModel
                    .updateMany(
                        { userId, companyTicker: ticker }, //condition
                        {
                            priceBoughtAt: stockPrice //update
                        }
                    )
                    .exec();
            }
            const totalAsset = totalInvested + amountHeld;
            let newUserAllocation = await assetAllocationModel
                .findOneAndUpdate(conditions, {
                    amountInvested: totalInvested,
                    amountHeld: amountHeld
                })
                .exec();
            newUserAllocation.totalAsset = totalAsset;

            return [undefined, newUserAllocation];
        } catch (error) {
            console.error("Error getting user's asset allocation", error);
            return [error, null];
        }
    },
    createAssetAllocation: async (userId, amountInvested, amountHeld) => {
        try {
            const doc = {
                userId,
                amountInvested,
                amountHeld
            };
            let assetAllocation = new assetAllocationModel(doc);
            assetAllocation = await assetAllocation.save();
            return [undefined, assetAllocation];
        } catch (error) {
            console.error('Error creating asset allocation', error);
            return [error, null];
        }
    },
    updateAssetAllocation: async (conditions, update) => {
        try {
            let userAssetAllocation = await assetAllocationModel
                .findOneAndUpdate(conditions, update)
                .exec();
            return [undefined, userAssetAllocation];
        } catch {}
    }
};
