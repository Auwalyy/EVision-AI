const Recommendation = require('../models/Recommendation');
const Location = require('../models/Location');
const { scoreLocation } = require('../utils/scoringEngine');

exports.getRecommendations = async (req, res, next) => {
  try {
    const { priority, limit = 50 } = req.query;
    const filter = {};
    if (priority) filter.priority = priority;

    const recs = await Recommendation.find(filter)
      .populate('locationId')
      .sort({ demandScore: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: recs.length, data: recs });
  } catch (err) {
    next(err);
  }
};

exports.generateRecommendations = async (req, res, next) => {
  try {
    const locations = await Location.find({ hasExistingStation: false });
    if (!locations.length) {
      return res.status(400).json({ error: 'No locations found to analyze' });
    }

    // Remove old recommendations
    await Recommendation.deleteMany({});

    const recommendations = locations.map((loc) => {
      const scores = scoreLocation(loc);
      return { locationId: loc._id, ...scores };
    });

    const created = await Recommendation.insertMany(recommendations);

    res.status(201).json({
      success: true,
      message: `Generated ${created.length} recommendations`,
      count: created.length,
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecommendation = async (req, res, next) => {
  try {
    const rec = await Recommendation.findById(req.params.id).populate('locationId');
    if (!rec) return res.status(404).json({ error: 'Recommendation not found' });
    res.json({ success: true, data: rec });
  } catch (err) {
    next(err);
  }
};
