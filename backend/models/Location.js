const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    populationDensity: { type: Number, required: true, min: 0, max: 100 },
    trafficVolume: { type: Number, required: true, min: 0, max: 100 },
    commercialScore: { type: Number, required: true, min: 0, max: 100 },
    evScore: { type: Number, required: true, min: 0, max: 100 },
    hasExistingStation: { type: Boolean, default: false },
    stationType: { type: String, enum: ['none', 'level1', 'level2', 'dcfast'], default: 'none' },
    nearbyPOIs: [{ type: String }],
    routeCoverage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

locationSchema.index({ city: 1 });
locationSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Location', locationSchema);
