const express = require('express');
const router = express.Router();
const { get_all_workers } = require("../controllers/workerController");
const { register_worker} = require("../controllers/authController");
const { verify_admin_token } = require("../middleware/authMiddleware");

const { add_service, get_all_services} = require("../controllers/serviceController");


// const myController = (req, res) => {
//     const data = {
//       title: 'My Page',
//       message: 'Hello from the controller!',
//       items: ['item1', 'item2', 'item3']
//     };
//     res.render('test_page', data); 
//   };

// router.get("/", myController);

router.get("/workers",  get_all_workers);
router.post('/workers', verify_admin_token, register_worker);

router.get("/services", get_all_services);
router.post('/services', verify_admin_token, add_service);

module.exports = router;