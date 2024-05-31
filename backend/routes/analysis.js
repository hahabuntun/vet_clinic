const express = require('express');
const fileUpload = require('express-fileupload');
const { uploadAnalysis, downloadAnalysis, getAnalysisByAnimal } = require('../controllers/analysisController');
const { verify_doctor_token, verify_doctor_or_client_token } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to handle file uploads
router.use(fileUpload());

router.post('/upload', verify_doctor_token, uploadAnalysis);
router.get('/download/:id', verify_doctor_or_client_token, downloadAnalysis);
router.get('/animal/:animal_id', verify_doctor_or_client_token, getAnalysisByAnimal);

module.exports = router;
