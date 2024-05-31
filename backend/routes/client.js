const express = require('express');
const { get_main_page } = require('../controllers/clientController');
const {get_client_animal_card_page, get_client_animal_card_view} = require("../controllers/petController");
const router = express.Router();

router.get("/clients/:clientId/main", get_main_page);
router.get("/clients/:client_id/pets/:pet_id/card", get_client_animal_card_view);
router.get("/clients/:client_id/pets/:pet_id/card/:page_id", get_client_animal_card_page);
// router.get("/clients/:client_id/appointments", get_single_doctor_shedule);
// router.get("/clients/:client_id/make_appointment", add_schedule_entry);
// router.get("/clients/:client_id/pet_card/:pet_id", delete_schedule_entry);

module.exports = router;