const mongoose = require("mongoose");


const Worker = require("../models/worker.js");


const path = require('path');


module.exports.get_all_workers  = async (req, res) => {
    const employees = await Worker.find({  });
    data = {
        employees: employees
    }
    res.render(path.join('system_administration_views', 'employees'), data);
};