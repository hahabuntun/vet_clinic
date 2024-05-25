const mongoose = require("mongoose");
const path = require('path');

const Worker = require("../models/worker.js");
const Animal = require("../models/animal.js");
const Service = require("../models/service.js");
const Appointment = require("../models/appointment.js");



module.exports.get_doctor_shedule = async (req, res) => {
    var queryDate = "";
    if(req.query.date != null){
        queryDate = new Date(req.query.date);
    }
    else{
        queryDate = new Date();
    }
    
    var services = await Service.find();
    var doctors = await Worker.find({type: "doctor"});
    
    const promises = doctors.map(async (doctor) => {
        const appointments = await Appointment.find({
            doctor_id: doctor._id,
            appointment_time: { $gte: queryDate, $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) }
        });
        const appointment_promises = appointments.map(async (appointment) => {
            const serv = await Service.find({_id: appointment.service_id});
            const service_name = serv[0].name;
            appointment.service_name = service_name;

            const hours = appointment.appointment_time.getHours().toString().padStart(2, '0');
            const minutes = appointment.appointment_time.getMinutes().toString().padStart(2, '0');
            const timeStr = `${hours}:${minutes}`;
            appointment.time = timeStr;
            return appointment;
        })
        doctor.appointments = await Promise.all(appointment_promises);
        return doctor;
    });

    const updated_doctors = await Promise.all(promises);

    data = {
        services: services,
        doctors: updated_doctors
    }
    res.render(path.join('clinic_administation_views', 'doctor_schedule'), data);
}

module.exports.add_schedule_entry = async (req, res) => {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const { service_id, doctor_id, appointment_time, date } = data;
        const currentDate = new Date();
        const fullAppointmentTime = date ?
            new Date(`${date}T${appointment_time}`) :
            new Date(`${currentDate.toISOString().slice(0, 10)}T${appointment_time}`);
        const appointment = new Appointment({ service_id: service_id, doctor_id: doctor_id, appointment_time: fullAppointmentTime, confirmed: false});
        await appointment.save();
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        //console.log(error);
        res.status(500).json({ error: 'Addition of schedule entry failed' });
    }
}

module.exports.change_schedule_entry = async (req, res) => {

}

module.exports.delete_schedule_entry = async (req, res) => {

}