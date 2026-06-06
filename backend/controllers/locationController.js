const Location = require('../models/Location');

exports.getLocations = async (req, res, next) => {
  try {
    const { city, hasExistingStation } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (hasExistingStation !== undefined) filter.hasExistingStation = hasExistingStation === 'true';

    const locations = await Location.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: locations.length, data: locations });
  } catch (err) {
    next(err);
  }
};

exports.getLocation = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json({ success: true, data: location });
  } catch (err) {
    next(err);
  }
};

exports.createLocation = async (req, res, next) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json({ success: true, data: location });
  } catch (err) {
    next(err);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json({ success: true, data: location });
  } catch (err) {
    next(err);
  }
};

exports.deleteLocation = async (req, res, next) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Location deleted' });
  } catch (err) {
    next(err);
  }
};
