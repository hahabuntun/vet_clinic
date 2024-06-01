const express = require('express');
const fileUpload = require('express-fileupload');
const { uploadAnalysis, downloadAnalysis, getAnalysisByAnimal } = require('../controllers/analysisController');
const { verify_doctor_token, verify_client_token } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to handle file uploads
router.use(fileUpload());

router.post('/upload', verify_doctor_token, uploadAnalysis);


router.get('/download_client/:id', verify_client_token, downloadAnalysis);
router.get('/download_animal_client/:animal_id', verify_client_token,  getAnalysisByAnimal);


router.get('/download_doctor/:id', verify_doctor_token, downloadAnalysis);
router.get('/download_animal_doctor/:animal_id', verify_doctor_token,  getAnalysisByAnimal);

module.exports = router;
