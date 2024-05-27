const mongoose = require("mongoose");
const path = require('path');

const Worker = require("../models/worker.js");
const Service = require("../models/service.js");
const Appointment = require("../models/appointment.js");



module.exports.get_doctor_shedule = async (req, res) => {
    var queryDate = new Date();

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
        var temp_appointments = await Promise.all(appointment_promises);
        doctor.appointments = temp_appointments.sort((a, b) => {
            const [aHour, aMinute] = a.time.split(':').map(Number);
            const [bHour, bMinute] = b.time.split(':').map(Number);

            if (aHour !== bHour) {
                return aHour - bHour;
            } else {
                return aMinute - bMinute;
            }
          });
        return doctor;
    });

    const updated_doctors = await Promise.all(promises);

    data = {
        services: services,
        doctors: updated_doctors
    }
    res.render(path.join('clinic_administation_views', 'doctor_schedule'), data);
}


module.exports.get_single_doctor_shedule = async(req, res) => {
    try{
        var queryDate = req.query.date;
        queryDate = new Date(queryDate);
        var today = new Date();
        var temp = [];
        if (queryDate.getMonth() >= today.getMonth() && queryDate.getDate() >= today.getDate()){
            if (queryDate.getMonth() == today.getMonth() && queryDate.getDate() == today.getDate()){
                temp = await Appointment.find({
                    doctor_id: req.params.id,
                    appointment_time: { $gte: today, $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) }
                });
            }
            else{
                temp = await Appointment.find({
                    doctor_id: req.params.id,
                    appointment_time: { $gte: queryDate, $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) }
                });
            }
        }
        appointments = temp;
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
        var temp_appointments = await Promise.all(appointment_promises);
        const updated_appointments = temp_appointments.sort((a, b) => {
           // Extract hours and minutes from the time strings
            const [aHour, aMinute] = a.time.split(':').map(Number);
            const [bHour, bMinute] = b.time.split(':').map(Number);

            // Compare hours first
            if (aHour !== bHour) {
                return aHour - bHour;
            } else {
                // If hours are equal, compare minutes
                return aMinute - bMinute;
            }
          });
          console.log(updated_appointments);
        return res.status(200).json({ appointments: updated_appointments });
    }catch(error){
        console.log(error);
        return res.status(400).json({ error: error });
        
    }
    
}


module.exports.add_schedule_entry = async (req, res) => {
    try {
        var data = JSON.parse(JSON.stringify(req.body));
        var { service_id, doctor_id, appointment_time, date } = data;
        date = new Date(date);
        
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const [hours, minutes] = appointment_time.split(':').map(Number);
        console.log(appointment_time);
        // Create a new Date object with the combined date and time
        const fullAppointmentTime = new Date(dateOnly);
        //var already_exists = Appointment.find({doctor_id: doctor_id, appointment_time: })
        fullAppointmentTime.setHours(hours);
        fullAppointmentTime.setMinutes(minutes);
        const appointment = new Appointment({ service_id: service_id, doctor_id: doctor_id, appointment_time: fullAppointmentTime, confirmed: false});
        await appointment.save();
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        //console.log(error);
        res.status(500).json({ error: 'Addition of schedule entry failed' });
        console.log(error);
    }
}

module.exports.delete_schedule_entry = async (req, res) => {
    try{
        const appointment_id = req.params.id;
        const deletedAppointment = await Appointment.findByIdAndDelete(appointment_id);
        if (deletedAppointment) {
            return res.status(200).json({ message: 'successfully deleted' });
        } 
        else 
        {
            return res.status(404).json({ error: 'Appointment not found' });
        }
    }
    catch(error){
        return res.status(500).json({error: "error occured when deleting object"});
    }
}


module.exports.get_appointment_page = async (req, res) => {
    var doctors = await Worker.find({type: "doctor"});
    data = {
        doctors: doctors
    }
    res.render(path.join('clinic_administation_views', 'make_appointment'), data);
}


module.exports.make_appointment = async (req, res) => {
    res.render(path.join('clinic_administation_views', 'make_appointment'));
}