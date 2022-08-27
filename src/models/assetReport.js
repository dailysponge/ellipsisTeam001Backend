const mongoose = require('mongoose');

const assetReportSchema = new mongoose.Schema(
    {
        userId: { type: Number, required: true },
        companyName: { type: String, required: true },
        companyTicker: { type: String, required: true },
        numberOfStocks: { type: Number, required: true },
        priceBoughtAt: { type: Number, required: true },
        percentageOfTotal: { type: Number, required: false }
    },
    { timestamps: true }
);

assetReportSchema.index({ userId: 1 });

const assetReportModel = mongoose.model('assetReport', assetReportSchema);
module.exports = assetReportModel;
