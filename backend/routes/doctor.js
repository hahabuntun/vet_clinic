const express = require('express');
const router = express.Router();

const { verify_doctor_token } = require("../middleware/authMiddleware");
const { get_animal_card_view, find_animal_page, get_animal_card_page, find_animals } = require("../controllers/petController");
const { get_single_doctor_shedule_page, get_doctor_appointments_page } = require("../controllers/workerController");
const {finish_appointment} = require("../controllers/appointmentController");
const {add_diagnosis, get_appoinment_diagnosis} = require("../controllers/diagnosisController");
const {add_symptom, get_appoinment_symptoms} = require("../controllers/symptomController");
const {add_procedure, get_appoinment_procedures} = require("../controllers/procedureController");



router.get("/doctors/:doctor_id/schedule", verify_doctor_token, get_single_doctor_shedule_page);
router.get("/doctors/:doctor_id/appointments", verify_doctor_token, get_doctor_appointments_page);
router.get("/doctors/:doctor_id/find_pets", verify_doctor_token,  find_animal_page);
router.get("/appointments/:page_id/diagnosis", verify_doctor_token, get_appoinment_diagnosis);
router.get("/appointments/:page_id/symptoms", verify_doctor_token, get_appoinment_symptoms);
router.get("/appointments/:page_id/procedures", verify_doctor_token, get_appoinment_procedures);
router.get("/doctors/:doctor_id/pets/:pet_id/card", verify_doctor_token, get_animal_card_view);
router.get("/doctors/:doctor_id/pets/:pet_id/card/:page_id", verify_doctor_token, get_animal_card_page);

router.get("/find_pets", find_animals);

router.post("/appointments/:page_id/diagnosis", add_diagnosis);
router.post("/appointments/:page_id/symptoms", add_symptom);
router.post("/appointments/:page_id/procedures", add_procedure);
router.patch("/appointments/:page_id/finish", finish_appointment);

module.exports = router;