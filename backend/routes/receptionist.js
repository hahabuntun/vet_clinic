const express = require('express');
const router = express.Router();
const { get_client, add_client, edit_client, get_all_clients, delete_client } = require("../controllers/clientController");
const { get_all_client_pets, add_pet_to_client, edit_client_pet, delete_client_pet} = require("../controllers/petController");
const {get_doctor_shedule, get_single_doctor_shedule, add_schedule_entry, delete_schedule_entry} = require("../controllers/appointmentController")
const { get_appointment_page, make_appointment, get_confirmed_bookings_page, get_unconfirmed_bookings_page, get_appointments } = require("../controllers/appointmentController")
const {approve_appointment, decline_appointment, start_appointment, cancel_appointment} = require("../controllers/appointmentController");

const { verify_receptionist_token } = require("../middleware/authMiddleware");



router.post('/clients', verify_receptionist_token, add_client);
router.get("/clients", verify_receptionist_token, get_all_clients)
router.patch('/clients/:clientId', verify_receptionist_token,  edit_client)
router.delete('/clients/:clientId', verify_receptionist_token,  delete_client)
router.get("/clients/:clientId/pets", verify_receptionist_token, get_all_client_pets)

router.post('/pets', verify_receptionist_token,  add_pet_to_client);
router.patch('/pets/:petId', verify_receptionist_token,  edit_client_pet)
router.delete('/pets/:petId', verify_receptionist_token, delete_client_pet)

router.get("/doctor_schedule", verify_receptionist_token, get_doctor_shedule);
router.get("/doctor_schedule/:id", get_single_doctor_shedule);
router.post("/doctor_schedule", verify_receptionist_token, add_schedule_entry);
router.delete("/doctor_schedule/:id", verify_receptionist_token, delete_schedule_entry);

router.get("/make_appointment", verify_receptionist_token, get_appointment_page);
router.post("/make_appointment", verify_receptionist_token, make_appointment);

router.get("/clients/find_by_passport/:passport", verify_receptionist_token, get_client);


router.get("/appointments", verify_receptionist_token, get_appointments);
router.post("/appointments/start/:appointment_id", verify_receptionist_token, start_appointment);
router.patch("/appointments/cancel/:appointment_id", verify_receptionist_token, cancel_appointment);
router.patch("/appointments/approve/:appointment_id", verify_receptionist_token, approve_appointment);
router.patch("/appointments/decline/:appointment_id", verify_receptionist_token, decline_appointment);
router.get("/unconfirmed_bookings", verify_receptionist_token, get_unconfirmed_bookings_page);
router.get("/confirmed_bookings", verify_receptionist_token, get_confirmed_bookings_page);




module.exports = router;