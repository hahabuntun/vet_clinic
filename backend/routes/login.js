const express = require('express');
const router = express.Router();
const { login_client, login_worker, get_login_page } = require("../controllers/authController");

router.get("/login", get_login_page);
router.post('/client_login', login_client);
router.post('/worker_login', login_worker);


module.exports = router;