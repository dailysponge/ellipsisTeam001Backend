const assetReportModel = require('../models/assetReport.js');
const assetAllocationModel = require('../models/assetAllocation.js');
const axios = require('axios');
// const { getAssetAllocation } = require('./assetAllocation');

async function getAssetAllocation(conditions) {
    try {
        let assetAllocation = await assetAllocationModel
            .findOne(conditions)
            .exec();
        return [null, assetAllocation];
    } catch (error) {
        console.error("Error getting user's asset allocation", error);
        return [error, null];
    }
}
async function getPrice(ticker) {
    try {
        const res = await axios.get(`/${ticker}`, {
            baseURL: 'https://fmpcloud.io/api/v3/quote',
            params: {
                apikey: '696e4097428fce0782cecf50a40cb83a'
            }
        });
        const assetData = res.data;
        return assetData;
    } catch (error) {
        console.error('Error getting price', error);
    }
}

const createAssetRecord = async (
    userId,
    companyName,
    companyTicker,
    numberOfStocks,
    priceBoughtAt
) => {
    try {
        const doc = {
            userId,
            companyName,
            companyTicker,
            numberOfStocks,
            priceBoughtAt
        };
        let assetRecord = new assetReportModel(doc);
        assetRecord = await assetRecord.save();
        return [undefined, assetRecord];
    } catch (error) {
        console.error('Error creating asset record', error);
        return [error, null];
    }
};
const getAssetReport = async (conditions) => {
    try {
        let newTable = [];
        let userAssetReport = await assetReportModel.find(conditions).exec();
        for (record of userAssetReport) {
            let totalAmount = record.priceBoughtAt * record.numberOfStocks;
            newTable.push({
                name: record.companyName,
                tickerName: record.companyTicker,
                amount: totalAmount
            });
        }
        console.log('THIS IS NEW TABLE', newTable);
        return [undefined, newTable];
    } catch (error) {
        console.error("Error getting user's asset report", error);
        return [error, null];
    }
};
module.exports = {
    getPrice: async (ticker) => {
        try {
            const res = await axios.get(`/${ticker}`, {
                baseURL: 'https://fmpcloud.io/api/v3/quote',
                params: {
                    apikey: '696e4097428fce0782cecf50a40cb83a'
                }
            });
            const assetData = res.data;
            return assetData;
        } catch (error) {
            console.error('Error getting price', error);
        }
    },
    getAssetReport: async (conditions) => {
        try {
            // to inject amount into table
            let newTable = [];
            let userAssetReport = await assetReportModel
                .find({ userId: conditions.userId })
                .exec();
            for (record of userAssetReport) {
                let totalAmount = record.priceBoughtAt * record.numberOfStocks;
                newTable.push({
                    name: record.companyName,
                    tickerName: record.companyTicker,
                    amount: totalAmount
                });
            }
            return [undefined, newTable];
        } catch (error) {
            console.error("Error getting user's asset report", error);
            return [error, null];
        }
    },

    buyAsset: async (userId, ticker) => {
        try {
            const query = assetAllocationModel.find({ userId });
            const assetAllocation = await query.exec();
            let amountHeld = assetAllocation[0].amountHeld;
            console.log('THIS IS AMOUNT HELD', amountHeld);

            const newAssetAllocation = await getAssetAllocation({ userId });
            console.log('THIS IS NEW ASSET ALLOC', newAssetAllocation);
            const amountInvested = newAssetAllocation[1];
            console.log('WHAT IS THIS: ', amountInvested);
            const assetData = await getPrice(ticker);
            const price = assetData[0].price;
            const name = assetData[0].name;
            const maxAmount = Math.floor(amountHeld / price);
            const [createRecordError, assetRecord] = await createAssetRecord(
                userId,
                name,
                ticker,
                maxAmount,
                price
            );

            // PATCH THAT SHIT, the %, HERE
            const doc = await getAssetReport({ userId });
            userAssetReport = doc[1];
            for (record of userAssetReport) {
                console.log('This is amount', record.amount);
                console.log('THIS IS INVESTED', amountInvested);
                const percentage = Math.floor(record.amount / amountInvested);
                const doc = assetReportModel
                    .findOneAndUpdate(
                        { userId },
                        { percentageOfTotal: percentage },
                        { new: true }
                    )
                    .exec();
            }

            // deduct amountHeld
            amountHeld -= maxAmount * price;
            await assetAllocationModel
                .findOneAndUpdate(
                    { userId }, //condition
                    {
                        amountHeld //update
                    }
                )
                .exec();

            if (createRecordError) {
                return [createRecordError, null];
            }
            return [undefined, assetRecord];
        } catch (error) {
            console.error('Error buying asset', error);
            return [error, null];
        }
    }
};
