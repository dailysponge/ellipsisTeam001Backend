const assetPerformanceModel = require('../models/assetPerformance.js');
const assetReportModel = require('../models/assetReport.js');
const axios = require('axios');

function dateConverter(dateObject) {
    let date = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    let year = dateObject.getFullYear();
    return `${year}-${month}-${date}`;
}

async function getPrice(ticker, date) {
    try {
        const res = await axios.get(`/${ticker}`, {
            baseURL: 'https://fmpcloud.io/api/v3/historical-price-full',
            params: {
                from: date, // date format: yyyy-mm-dd
                to: date,
                apikey: '696e4097428fce0782cecf50a40cb83a'
            }
        });
        const assetData = res.data;
        return assetData;
    } catch (error) {
        console.error('Error getting price', error);
    }
}

async function getPortfolioByDate(userId, date) {
    try {
        totalPortfolioValue = 0;
        const query = await assetReportModel
            .find({
                userId,
                dateBoughtAt: { $lte: date }
            })
            .exec();

        const assetReportByDate = query;
        console.log('THIS IS QUERY', assetReportByDate);
        for (record of assetReportByDate) {
            let dateBoughtAt = record.dateBoughtAt;
            currDate = dateConverter(dateBoughtAt);
            let stockPriceAtDate = await getPrice(
                record.companyTicker,
                currDate
            );
            stockPriceAtDate = stockPriceAtDate.historical[0].close;
            totalPortfolioValue += stockPriceAtDate * record.numberOfStocks;
        }
        return [undefined, totalPortfolioValue];
    } catch (error) {
        console.error('Error getting portfolio value', error);
        return [error, null];
    }
}
async function createAssetPerformanceRecord(userId, date) {
    try {
        const [finalPortfolioValueError, finalPortfolioValue] =
            await getPortfolioByDate(userId, new Date(date));
        if (finalPortfolioValueError) {
            throw new error(finalPortfolioValueError);
        }
        const currentDate = new Date(date);
        const doc = {
            userId,
            date: currentDate,
            finalPortfolioValue
        };

        let assetPerformance = new assetPerformanceModel(doc);
        assetPerformance = await assetPerformance.save();
        return [undefined, assetPerformance];
    } catch (error) {
        console.error('Error creating asset performance record', error);
        return [error, null];
    }
}
module.exports = {
    generateAssetPerformanceTable: async (userId) => {
        try {
            for (let i = 1; i <= 28; i++) {
                await createAssetPerformanceRecord(userId, `2022-08-${i}`);
            }

            return [null, true];
        } catch (error) {
            console.error('Error generating asset performance table', error);
            return [error, null];
        }
    },
    findAssetPerformance: async (userId) => {
        try {
            const sortedAssetPerformance = await assetPerformanceModel
                .find({ userId })
                .sort({ date: 'desc' })
                .exec();
            return [null, sortedAssetPerformance];
        } catch (error) {
            console.error('Error finding asset performance', error);
            return [error, null];
        }
    }
};
