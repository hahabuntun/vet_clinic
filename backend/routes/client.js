const express = require('express');
const { get_main_page } = require('../controllers/clientController');
const {get_client_animal_card_page, get_client_animal_card_view} = require("../controllers/petController");
const {get_client_appointments_page, get_client_appointments, cancel_appointment, get_appointment_page, make_appointment} = require("../controllers/appointmentController");
const {get_appoinment_diagnosis} = require("../controllers/diagnosisController");
const {get_appoinment_symptoms} = require("../controllers/symptomController");
const {get_appoinment_procedures} = require("../controllers/procedureController");

const { verify_client_token } = require('../middleware/authMiddleware');
const router = express.Router();



router.get("/clients/:clientId/main", verify_client_token, get_main_page);
router.get("/clients/:client_id/pets/:pet_id/card", verify_client_token, get_client_animal_card_view);
router.get("/clients/:client_id/pets/:pet_id/card/:page_id", verify_client_token, get_client_animal_card_page);
router.get("/clients/:client_id/appointments", verify_client_token, get_client_appointments_page);
router.get("/clients/:client_id/all_appointments", verify_client_token, get_client_appointments);
router.get("/clients/:client_id/make_booking", verify_client_token, get_appointment_page);
router.get("/clients/appointments/:page_id/diagnosis", verify_client_token, get_appoinment_diagnosis);
router.get("/clients/appointments/:page_id/symptoms", verify_client_token, get_appoinment_symptoms);
router.get("/clients/appointments/:page_id/procedures", verify_client_token, get_appoinment_procedures);


router.post("/clients/:client_id/make_appointment",verify_client_token, make_appointment);
router.patch("/clients/:client_id/appointments/cancel/:appointment_id",verify_client_token, cancel_appointment);

module.exports = router;