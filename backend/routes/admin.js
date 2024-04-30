const express = require('express');
const router = express.Router();
const { register_worker} = require("../controllers/authController");
const { verify_admin_token } = require("../middleware/authMiddleware");


router.post('/add_worker', verify_admin_token, register_worker);


module.exports = router;