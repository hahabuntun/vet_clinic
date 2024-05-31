const express = require('express');
const { get_main_page } = require('../controllers/clientController');
const {get_client_animal_card_page, get_client_animal_card_view} = require("../controllers/petController");
const {get_client_appointments_page, get_client_appointments, cancel_appointment, get_appointment_page, make_appointment} = require("../controllers/appointmentController");
const router = express.Router();

router.get("/clients/:clientId/main", get_main_page);
router.get("/clients/:client_id/pets/:pet_id/card", get_client_animal_card_view);
router.get("/clients/:client_id/pets/:pet_id/card/:page_id", get_client_animal_card_page);
router.get("/clients/:client_id/appointments", get_client_appointments_page);
router.get("/clients/:client_id/all_appointments", get_client_appointments);
router.get("/clients/:client_id/make_booking", get_appointment_page);

router.post("/clients/:client_id/make_appointment", make_appointment);
router.patch("/clients/:client_id/appointments/cancel/:appointment_id", cancel_appointment);

module.exports = router;