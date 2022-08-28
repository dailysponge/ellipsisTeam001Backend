const mongoose = require('mongoose');

const assetPerformanceSchema = new mongoose.Schema(
    {
        userId: { type: Number, required: true },
        date: { type: Date, required: true },
        finalPortfolioValue: { type: Number, required: true },
    },
    {timestamps: true}
);

assetPerformanceSchema.index({ userId: 1 });

const assetPerformanceModel = mongoose.model('assetPerformance', assetPerformanceSchema);
module.exports = assetPerformanceModel;
