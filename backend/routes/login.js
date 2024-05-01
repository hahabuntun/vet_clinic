const express = require('express');
const router = express.Router();
const { login_client, login_worker } = require("../controllers/authController");


router.post('/client_login', login_client);

router.post('/worker_login', login_worker);


module.exports = router;