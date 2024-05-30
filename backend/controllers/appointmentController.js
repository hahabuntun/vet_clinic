const mongoose = require("mongoose");
const path = require('path');

const Worker = require("../models/worker.js");
const Service = require("../models/service.js");
const Appointment = require("../models/appointment.js");
const Animal = require("../models/animal.js");
const Client = require("../models/client.js");
const AnimalCardPage = require("../models/animal_card_page.js");


module.exports.get_doctor_shedule = async (req, res) => {
    var services = await Service.find();
    var doctors = await Worker.find({type: "doctor"});
    

    data = {
        services: services,
        doctors: doctors
    }
    res.render(path.join('clinic_administation_views', 'doctor_schedule'), data);
}


module.exports.get_single_doctor_shedule = async(req, res) => {
    try{
        var queryDate = req.query.date;
        queryDate = new Date(queryDate);
        var temp = [];
        temp = await Appointment.find({
            doctor_id: req.params.id,
            appointment_time: { $gte: queryDate, $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) },

        });
        appointments = temp;
        const appointment_promises = appointments.map(async (appointment) => {
            const serv = await Service.find({_id: appointment.service_id});
            const service_name = serv[0].name;
            appointment.service_name = service_name;
    
            const hours = appointment.appointment_time.getHours().toString().padStart(2, '0');
            const minutes = appointment.appointment_time.getMinutes().toString().padStart(2, '0');
            const timeStr = `${hours}:${minutes}`;
            appointment.time = timeStr;
            var animal = await Animal.findOne({_id: appointment.animal_id});
            if (animal){
                appointment.animal_data = animal.breed + " " +  animal.type + " " + animal.name;
            }
            
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
    try{
        var {appointment_id, animal_id} = JSON.parse(JSON.stringify(req.body));
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointment_id },
            { $set: { animal_id: animal_id, confirmed: true } },
            { new: true }
          );
        return res.status(200).json({message: "success"});
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({error: "failed to make an appointment"});
    }
}



module.exports.get_appointments = async (req, res) =>{
    try{
        var queryDate = req.query.date;
        var confirmed = req.query.confirmed;
        queryDate = new Date(queryDate);
        var temp = [];
        temp = await Appointment.find({
            appointment_time: { $gte: queryDate, $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) },
            animal_id: { $exists: true },
            confirmed: confirmed,
            animal_card_page_id:  { $exists: false},
        });
        
        appointments = temp;
    
        const appointment_promises = appointments.map(async (appointment) => {
            const serv = await Service.find({_id: appointment.service_id});
            const service_name = serv[0].name;
            appointment.service_name = service_name;
    
            const hours = appointment.appointment_time.getHours().toString().padStart(2, '0');
            const minutes = appointment.appointment_time.getMinutes().toString().padStart(2, '0');
            const timeStr = `${hours}:${minutes}`;
            appointment.time = timeStr;
    
            var doctor = await Worker.findOne({_id: appointment.doctor_id});
            appointment.doctor_full_name = doctor.name + " " + doctor.second_name + " " + doctor.third_name;
    
            var animal = await Animal.findOne({_id: appointment.animal_id});
            appointment.animal_data = animal.breed + " " +  animal.type + " " + animal.name;
    
            var client = await Client.findOne({_id: animal.client_id});
            appointment.client_data = client.name + " " + client.second_name + " " + client.third_name;
            appointment.client_id = client._id;
            appointment.client_phone = client.phone;
            return appointment;
        })
        var temp_appointments = await Promise.all(appointment_promises);
        const updated_appointments = temp_appointments.sort((a, b) => {
            // Extract hours and minutes from the time strings
             const [aHour, aMinute] = a.time.split(':').map(Number);
             const [bHour, bMinute] = b.time.split(':').map(Number);
    
             // Compare hours first
             if (aHour !== bHour) {
                 return bHour - aHour;
             } else {
                 // If hours are equal, compare minutes
                 return  bMinute - aMinute;
             }
        });
        var data = {
            appointments: updated_appointments
        }
        res.status(200).json(data);
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Could not return page"});
    }
}


module.exports.get_unconfirmed_bookings_page = async (req, res) =>{
    try{
        res.render(path.join('clinic_administation_views', 'unconfirmed_bookings'));
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Could not return page"});
    }
}

module.exports.approve_appointment = async (req, res) => {
    try{
        var appointment_id = req.params.appointment_id;
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointment_id },
            { $set: { confirmed: true } },
            { new: true }
          );
        return res.status(200).json({message: "success"});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Could not approve appointment"});
    }
}

module.exports.decline_appointment = async (req, res) => {
    try{
        var appointment_id = req.params.appointment_id;
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointment_id },
            { $unset: { animal_id: '' } },
            { new: true }
          );
        return res.status(200).json({message: "success"});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Could not approve appointment"});
    }
}

module.exports.get_confirmed_bookings_page = async (req, res) =>{
    res.render(path.join('clinic_administation_views', 'confirmed_bookings'));
}


module.exports.start_appointment = async (req, res) => {
    try{
        var appointment_id = req.params.appointment_id;
        var appointment = await Appointment.findOne({_id: appointment_id});
        var animal_card_page = new AnimalCardPage({animal_id: appointment.animal_id, appointment_id: appointment._id});
        await animal_card_page.save();
        var updated_app = await Appointment.findOneAndUpdate(
            { _id: appointment_id },
            { $set: { animal_card_page_id: animal_card_page._id } },
            { new: true }
          );
        
        return res.status(201).json({message: "success"});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Could not approve appointment"});
    }
}

module.exports.cancel_appointment = async (req, res) => {
    try{
        var appointment_id = req.params.appointment_id;
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointment_id },
            { $unset: { animal_id: '' } },
            { $set: { confirmed: false } },
            { new: true }
          );
        return res.status(200).json({message: "success"});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Could not approve appointment"});
    }
}