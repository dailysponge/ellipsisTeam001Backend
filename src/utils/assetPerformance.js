const assetPerformanceModel = require("../models/assetPerformance.js");
const assetReportModel = require("../models/assetReport.js");
const axios = require("axios");

async function getPrice(ticker,date) {
    try {
        const res = await axios.get(`/${ticker}`, {
            baseURL: 'https://fmpcloud.io/api/v3/historical-price-full',
            params: {
                from: date, // date format: yyyy-mm-dd
                to: date,
                apikey: '696e4097428fce0782cecf50a40cb83a',
            }
        });
        const assetData = res.data;
        return assetData;
    } catch (error) {
        console.error('Error getting price', error);
    }
}

async function getPortfolioByDate (userId, date) {
    try {
        totalPortfolioValue = 0;
        const query = await assetReportModel.find({
            userId,
            dateBoughtAt: {
                $lte: date
            }
        }).exec();
        const assetReportByDate = query[0];
        for(record of assetReportByDate) {
            dateBoughtAt = record.dateBoughtAt;
            stockPriceAtDate = await getPrice(record.companyTicker);
            totalPortfolioValue += stockPriceAtDate * record.numberOfStocks;
        }
        return [undefined, totalPortfolioValue];
    } catch (error) {
        console.error('Error getting portfolio value', error);
        return [error, null];
    }
}
async function createAssetPerformanceRecord (userId, date){
    try{
        const finalPortfolioValue = await getPortfolioByDate(userId, date);
        const doc = {
            userId, 
            date,
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
    generateAssetPerformanceTable: async  (userId) => {
        try{
            for(let i=1; i<=28; i++) {
                await createAssetPerformanceRecord(userId, `2022-08-${i}`);
                return [undefine, true];
            }
        } catch (error) {
            console.error('Error generating asset performance table', error);
            return [error, null];
        }
    },
    findAssetPerformance: async(userId) => {
        try{
            const sortedAssetPerformance = await assetPerformanceModel.find({userId}).sort({ date: 'desc' }).exec();
            return[null, sortedAssetPerformance];
        } catch (error) {
            console.error('Error finding asset performance', error);
            return [error, null];
        }
    }
}