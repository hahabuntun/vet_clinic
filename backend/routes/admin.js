const express = require('express');
const router = express.Router();
const { get_all_workers, add_worker, edit_worker, delete_worker } = require("../controllers/workerController");
const { verify_admin_token } = require("../middleware/authMiddleware");
const { add_service, get_all_services, edit_service, delete_service} = require("../controllers/serviceController");

router.get("/workers",  get_all_workers);
router.post('/workers',  add_worker);
router.patch('/workers/:workerId',  edit_worker);
router.delete('/workers/:workerId',  delete_worker);
router.get("/services", get_all_services);
router.post('/services',  add_service);
router.patch('/services/:serviceId', edit_service)
router.delete('/services/:serviceId',  delete_service)

module.exports = router;