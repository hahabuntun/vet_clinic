const express = require('express');
const router = express.Router();
const { register_client } = require("../controllers/authController");
const { verify_receptionist_token } = require("../middleware/authMiddleware");


router.post('/add_client', verify_receptionist_token, register_client);