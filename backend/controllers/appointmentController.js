const mongoose = require("mongoose");
const path = require('path');

const Worker = require("../models/worker.js");
const Animal = require("../models/animal.js");
const Service = require("../models/service.js");
const Appointment = require("../models/appointment.js");



module.exports.get_doctor_shedule = async (req, res) => {
    const services = await Service.find();
    const doctors = await Worker.find({type: "doctor"});
    data = {
        services: services,
        doctors: doctors
    }
    res.render(path.join('clinic_administation_views', 'doctor_schedule'), data);
}

module.exports.add_schedule_entry = async (req, res) => {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const { service_id, doctor_id, appointment_time } = data;
        console.log(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Addition of schedule entry failed' });
    }
}

module.exports.change_schedule_entry = async (req, res) => {

}

module.exports.delete_schedule_entry = async (req, res) => {

}