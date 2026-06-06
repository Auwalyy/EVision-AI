const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    snapshotDate: { type: Date, default: Date.now },
    totalLocations: Number,
    recommendedStations: Number,
    highDemandZones: Number,
    avgDemandScore: Number,
    avgUtilization: Number,
    cityBreakdown: [
      {
        city: String,
        avgDemand: Number,
        stationCount: Number,
        totalInvestment: Number,
      },
    ],
    forecastData: [
      {
        month: String,
        utilization: Number,
        demandGrowth: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
