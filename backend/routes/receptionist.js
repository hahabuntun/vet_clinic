const express = require('express');
const router = express.Router();
const { add_client, edit_client, get_all_clients, delete_client } = require("../controllers/clientController");
const { get_all_client_pets, add_pet_to_client, edit_client_pet, delete_client_pet} = require("../controllers/petController");
const { verify_receptionist_token } = require("../middleware/authMiddleware");


router.post('/clients',verify_receptionist_token, add_client);
router.get("/clients", get_all_clients)
router.patch('/clients/:clientId', verify_receptionist_token, edit_client)
router.delete('/clients/:clientId', verify_receptionist_token, delete_client)



router.post('/clients/:clientId/pets', verify_receptionist_token, add_pet_to_client);
router.get("/clients/:clientId/pets", get_all_client_pets)
router.patch('/clients/:clientId/pets/:petId', verify_receptionist_token, edit_client_pet)
router.delete('/clients/:clientId/pets/:petId', verify_receptionist_token, delete_client_pet)

module.exports = router;