const express = require('express');
const router = express.Router();
const { get_all_workers, add_worker, edit_worker, delete_worker } = require("../controllers/workerController");
const { verify_admin_token } = require("../middleware/authMiddleware");
const { add_service, get_all_services, edit_service, delete_service} = require("../controllers/serviceController");

router.get("/workers", verify_admin_token,  get_all_workers);
router.post('/workers',verify_admin_token,  add_worker);
router.patch('/workers/:workerId',verify_admin_token,  edit_worker);
router.delete('/workers/:workerId',verify_admin_token,  delete_worker);
router.get("/services",verify_admin_token, get_all_services);
router.post('/services',verify_admin_token,  add_service);
router.patch('/services/:serviceId',verify_admin_token, edit_service);
router.delete('/services/:serviceId',verify_admin_token,  delete_service);

module.exports = router;