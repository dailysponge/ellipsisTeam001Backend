const assetReportModel = require('../models/assetReport.js');
const assetAllocationModel = require('../models/assetAllocation.js');

const axios = require('axios');

function randomNumber(maxAmount) {
    if (maxAmount < 1) return 0;
    return Math.floor(Math.random() * maxAmount) + 1;
}

// copied over from assetAllocation due to cicular dependency bug
async function findAssetAllocation(conditions) {
    // patch at the same time
    try {
        const userId = conditions.userId;
        let userAssetAllocation = await assetAllocationModel
            .find(conditions)
            .exec();
        let amountHeld = userAssetAllocation[0].amountHeld;

        let userAssetReport = await assetReportModel.find(conditions).exec();
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
            .findOneAndUpdate(
                conditions,
                {
                    amountInvested: totalInvested,
                    amountHeld: amountHeld
                },
                { new: true }
            )
            .exec();
        newUserAllocation.totalAsset = totalAsset;

        return [undefined, newUserAllocation];
    } catch (error) {
        console.error("Error getting user's asset allocation", error);
        return [error, null];
    }
}

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
// connecting to external API to get current stock price
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

// adding new record to the assetReport table
const createAssetRecord = async (
    userId,
    companyName,
    companyTicker,
    numberOfStocks,
    priceBoughtAt,
    dateBoughtAt
) => {
    try {
        const doc = {
            userId,
            companyName,
            companyTicker,
            numberOfStocks,
            priceBoughtAt,
            dateBoughtAt
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
        // filtering the records in the assetReport table to only have: name, tickerName & amount
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
    // random number between 1 and 100

    buyAsset: async (userId, ticker) => {
        try {
            const query = assetAllocationModel.find({ userId });
            const assetAllocation = await query.exec();
            let amountHeld = assetAllocation[0].amountHeld;

            const newAssetAllocation = await getAssetAllocation({ userId });

            let amountInvested = newAssetAllocation[1].amountInvested;
            const assetData = await getPrice(ticker);
            const price = assetData[0].price;
            const name = assetData[0].name;
            const maxAmount = Math.floor(amountHeld / price);
            // buying random of stocks
            const numberOfStocks = randomNumber(maxAmount);
            const dateBoughtAt = new Date().toLocaleDateString('en-US');
            if (!numberOfStocks == 0) {
                const [createRecordError, assetRecord] =
                    await createAssetRecord(
                        userId,
                        name,
                        ticker,
                        numberOfStocks,
                        price,
                        dateBoughtAt
                    );

                const refreshAssetAllocation = await findAssetAllocation({
                    userId
                });
                amountInvested = refreshAssetAllocation[1].amountInvested;

                // deduct amountHeld
                amountHeld -= numberOfStocks * price;
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
            } else {
                return [undefined, null];
            }
        } catch (error) {
            console.error('Error buying asset', error);
            return [error, null];
        }
    }
};
