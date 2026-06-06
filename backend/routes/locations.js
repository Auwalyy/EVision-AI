const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/locationController');
const auth = require('../middleware/auth');

router.get('/', ctrl.getLocations);
router.get('/:id', ctrl.getLocation);
router.post('/', auth, ctrl.createLocation);
router.put('/:id', auth, ctrl.updateLocation);
router.delete('/:id', auth, ctrl.deleteLocation);

module.exports = router;
