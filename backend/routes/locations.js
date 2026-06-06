const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/locationController');

router.get('/', ctrl.getLocations);
router.get('/:id', ctrl.getLocation);
router.post('/', ctrl.createLocation);
router.put('/:id', ctrl.updateLocation);
router.delete('/:id', ctrl.deleteLocation);

module.exports = router;
