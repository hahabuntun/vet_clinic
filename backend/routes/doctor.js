const express = require('express');
const router = express.Router();

const { verify_doctor_token } = require("../middleware/authMiddleware");
const { get_animal_card_view, get_animal_card_page } = require("../controllers/petController");
const { get_single_doctor_shedule_page, get_doctor_appointments_page } = require("../controllers/workerController");





router.get("/doctors/:doctor_id/schedule", get_single_doctor_shedule_page);
router.get("/doctors/:doctor_id/appointments", get_doctor_appointments_page);
router.get("/pets/card", get_animal_card_view);
router.get("/pets/:pet_id/card/:page_id", get_animal_card_page);

module.exports = router;