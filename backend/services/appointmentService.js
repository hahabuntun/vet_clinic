const mongoose = require("mongoose");
const path = require('path');

const Worker = require("../models/worker.js");
const Service = require("../models/service.js");
const Appointment = require("../models/appointment.js");
const Animal = require("../models/animal.js");
const Client = require("../models/client.js");
const AnimalCardPage = require("../models/animal_card_page.js");


module.exports.get_animal_appointments_s = async (animal_id, appointment_exists) => {
    var appointments = await Appointment.find({animal_id: animal_id, animal_card_page_id:  { $exists: appointment_exists}});
    var animal = await Animal.findOne({_id: animal_id});
    var client = await Client.findOne({_id: animal.client_id});
    const appointment_promises = appointments.map(async (appointment) => {
        var animal_card_page = await AnimalCardPage.findOne({_id: appointment.animal_card_page_id});
        if (animal_card_page.finished == true){
          appointment.status = "завершен";
        }else{
          appointment.status = "не завершен";
        }
        const serv = await Service.find({_id: appointment.service_id});
        const service_name = serv[0].name;
        appointment.service_name = service_name;

        const hours = appointment.appointment_time.getHours().toString().padStart(2, '0');
        const minutes = appointment.appointment_time.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        appointment.time = timeStr;
        var date = appointment.appointment_time.getFullYear() + "." + appointment.appointment_time.getMonth() + "." + appointment.appointment_time.getDate();
        appointment.date = date;
        var doctor = await Worker.findOne({_id: appointment.doctor_id});
        appointment.doctor_full_name = doctor.name + " " + doctor.second_name + " " + doctor.third_name;
        appointment.client_data = client.name + " " + client.second_name + " " + client.third_name;
        appointment.client_id = client._id;
        appointment.client_phone = client.phone;
        return appointment;
    })
    var temp_appointments = await Promise.all(appointment_promises);
    return temp_appointments;
}


module.exports.get_appointment_by_id_and_add_client_s = async (appointment_id, client) => {
  var appointment = await Appointment.findOne({_id: appointment_id});
  var animal_card_page = await AnimalCardPage.findOne({_id: appointment.animal_card_page_id});
  if (animal_card_page.finished == true){
    appointment.status = "завершен";
  }else{
    appointment.status = "не завершен";
  }
  var service = await Service.findOne({_id: appointment.service_id});
  appointment.service_name = service.name;
  const hours = appointment.appointment_time.getHours().toString().padStart(2, '0');
  const minutes = appointment.appointment_time.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  appointment.time = timeStr;
  var date = appointment.appointment_time.getFullYear() + "." + appointment.appointment_time.getMonth() + "." + appointment.appointment_time.getDate();
  appointment.date = date;
  appointment.client_data = client.name + " " + client.second_name + " " + client.third_name;
  appointment.client_id = client._id;
  appointment.client_phone = client.phone;
  return appointment;
}