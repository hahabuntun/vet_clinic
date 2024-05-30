const express = require('express');
const { get_main_page } = require('../controllers/clientController');
const router = express.Router();

router.get("/clients/:client_id/main", get_main_page);
// router.get("/clients/:client_id/appointments", get_single_doctor_shedule);
// router.get("/clients/:client_id/make_appointment", add_schedule_entry);
// router.get("/clients/:client_id/pet_card/:pet_id", delete_schedule_entry);

module.exports = router;