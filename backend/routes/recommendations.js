const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

router.get('/', ctrl.getRecommendations);
router.post('/generate', auth, ctrl.generateRecommendations);
router.get('/:id', ctrl.getRecommendation);

module.exports = router;
