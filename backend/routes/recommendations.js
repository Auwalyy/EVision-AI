const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recommendationController');

router.get('/', ctrl.getRecommendations);
router.post('/generate', ctrl.generateRecommendations);
router.get('/:id', ctrl.getRecommendation);

module.exports = router;
