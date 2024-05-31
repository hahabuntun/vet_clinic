const express = require('express');
const fileUpload = require('express-fileupload');
const { uploadAnalysis, downloadAnalysis, getAnalysisByAnimal } = require('../controllers/analysisController');

const router = express.Router();

// Middleware to handle file uploads
router.use(fileUpload());

router.post('/upload', uploadAnalysis);
router.get('/download/:id', downloadAnalysis);
router.get('/animal/:animal_id', getAnalysisByAnimal);

module.exports = router;
