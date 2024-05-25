const express = require('express');
const router = express.Router();
const { add_client, edit_client, get_all_clients, delete_client } = require("../controllers/clientController");
const { get_all_client_pets, add_pet_to_client, edit_client_pet, delete_client_pet} = require("../controllers/petController");
const {get_doctor_shedule, get_single_doctor_shedule, add_schedule_entry, change_schedule_entry, delete_schedule_entry} = require("../controllers/appointmentController")
const { verify_receptionist_token } = require("../middleware/authMiddleware");


router.post('/clients', add_client);
router.get("/clients", get_all_clients)
router.patch('/clients/:clientId',  edit_client)
router.delete('/clients/:clientId',  delete_client)
router.get("/clients/:clientId/pets", get_all_client_pets)

router.post('/pets',  add_pet_to_client);
router.patch('/pets/:petId',  edit_client_pet)
router.delete('/pets/:petId', delete_client_pet)

router.get("/doctor_schedule", get_doctor_shedule);
router.get("/doctor_schedule/:id", get_single_doctor_shedule);
router.post("/doctor_schedule", add_schedule_entry);
router.put("/doctor_schedule/:id", change_schedule_entry);
router.delete("/doctor_schedule/:id", delete_schedule_entry);


module.exports = router;