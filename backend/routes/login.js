const express = require('express');
const router = express.Router();
const { login_client, login_worker } = require("../controllers/authController");
const { verify_receptionist_token, verify_client_token, verify_doctor_token, verify_admin_token } = require("../middleware/authMiddleware");


router.post('/client_login', verify_client_token, login_client);

router.post('/doctor_login', verify_doctor_token, login_worker);

router.post('/receptionist_login', verify_receptionist_token, login_worker);

router.post('/admin_login', verify_admin_token, login_worker);


module.exports = router;