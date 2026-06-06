const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    demandScore: { type: Number, required: true, min: 0, max: 100 },
    investmentScore: { type: Number, required: true, min: 0, max: 100 },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
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
