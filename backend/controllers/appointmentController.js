const mongoose = require("mongoose");
const path = require('path');
const {get_all_services_without_params_s} = require("../services/serviceService.js");
const {get_all_doctors_s} = require("../services/workerService.js");
const {get_doctor_schedule_s, add_schedule_entry_s, delete_appointment_by_id_s,
     make_appointment_s, get_bookings_s, approve_appointment_s, decline_appointment_s,
    cancel_appointment_s, start_appointment_s, finish_appointment_s,get_appointment_by_id_s,get_client_appointments_s} = require("../services/appointmentService.js");
const {get_client_by_id_s} = require("../services/clientService.js");
const {get_animals_by_client_id_s} = require("../services/petService.js")
const {add_animal_card_page_s} = require("../services/animalCardPageService.js")


module.exports.get_doctor_shedule = async (req, res) => {
    var services = await get_all_services_without_params_s();
    var doctors = await get_all_doctors_s();
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
        var appointments = await get_doctor_schedule_s(req.params.id, queryDate);
        return res.status(200).json({ appointments: appointments });
    }catch(error){
        console.log(error);
        return res.status(400).json({ error: error });
    }
}
module.exports.add_schedule_entry = async (req, res) => {
    try {
        var data = JSON.parse(JSON.stringify(req.body));
        var { service_id, doctor_id, appointment_time, date } = data;
        var new_appointment = await add_schedule_entry_s(service_id, doctor_id, appointment_time, date);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(500).json({ error: 'Addition of schedule entry failed' });
        console.log(error);
    }
}
module.exports.delete_schedule_entry = async (req, res) => {
    try{
        const appointment_id = req.params.id;
        const deletedAppointment = await delete_appointment_by_id_s(appointment_id);
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
    var {client_id} = req.params;
    var client = {}
    var pets = {};
    var user_type = "receptionist";
    if (client_id){
        user_type = "client";
        client = await get_client_by_id_s(client_id);
        pets = await get_animals_by_client_id_s(client_id);
    }   
    var doctors = await get_all_doctors_s();
    data = {
        doctors: doctors,
        user_type: user_type,
        client: client,
        pets: pets
    }
    res.render('make_appointment', data);
}
module.exports.make_appointment = async (req, res) => {
    try{
        var confirmed = true;
        if (Object.keys(req.params).length != 0){
            console.log(Object.keys(req.params).length);
            confirmed = false;
        }
        var {appointment_id, animal_id} = JSON.parse(JSON.stringify(req.body));
        const updatedAppointment = await make_appointment_s(animal_id, confirmed, appointment_id);
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
        var appointments = await get_bookings_s(queryDate, confirmed);
        var data = {
            appointments: appointments
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
        const updatedAppointment = await approve_appointment_s(appointment_id);
        return res.status(200).json({message: "success"});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Could not approve appointment"});
    }
}
module.exports.decline_appointment = async (req, res) => {
    try{
        var appointment_id = req.params.appointment_id;
        const updatedAppointment = await decline_appointment_s(appointment_id);
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
        var appointment = await get_appointment_by_id_s(appointment_id);
        var animal_card_page = await add_animal_card_page_s(appointment.animal_id, appointment._id);
        var updated_app = await start_appointment_s(appointment_id, animal_card_page._id);
        return res.status(201).json({message: "success"});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Could not approve appointment"});
    }
}
module.exports.cancel_appointment = async (req, res) => {
    try{
        var appointment_id = req.params.appointment_id;
        const updatedAppointment = await cancel_appointment_s(appointment_id);
        return res.status(200).json({message: "success"});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Could not cancel appointment"});
    }
}
module.exports.finish_appointment = async (req, res) =>{
    try{
        var {page_id} = req.params;
        const updatedpage = await finish_appointment_s(page_id);
        return res.status(200).json({message: "success"});
    }catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
}
module.exports.get_client_appointments_page = async (req, res) => {
    try{
        const {client_id} = req.params;
        const client = await get_client_by_id_s(client_id);
        var data = {
            client: client
        }
        res.render(path.join('client_views', 'bookings'), data);
    }catch(error){
        res.status(500).json({error: error});
    }
}

module.exports.get_client_appointments = async (req, res) => {
    try{
        const {client_id} = req.params;
        var queryDate = req.query.date;
        queryDate = new Date(queryDate);
        var appointments = await get_client_appointments_s(client_id, queryDate);
        
        var data = {
            appointments: appointments
        }
        return res.status(200).json(data);
    }catch(error){
        res.status(500).json({error: error});
    }
}