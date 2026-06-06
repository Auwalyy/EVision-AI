const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },

    // Core AI scores
    demandScore: { type: Number, required: true, min: 0, max: 100 },
    investmentScore: { type: Number, required: true, min: 0, max: 100 },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },

    // Spec-required field names
    demandForecast: { type: Number },          // 12-month projected demand
    utilizationEstimate: { type: Number },      // alias of estimatedUtilization
    roiCategory: { type: String, enum: ['High Potential', 'Medium Potential', 'Low Potential'] },
    recommendationReason: { type: String },     // alias of aiInsight

    // Extended investment fields
    estimatedROI: { type: Number },
    chargersNeeded: { type: Number, default: 2 },
    estimatedCost: { type: Number },
    estimatedUtilization: { type: Number },
    routeGapScore: { type: Number, default: 0 },
    aiInsight: { type: String },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    paybackPeriodMonths: { type: Number },
  },
  { timestamps: true }
);

recommendationSchema.index({ demandScore: -1 });
recommendationSchema.index({ priority: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
