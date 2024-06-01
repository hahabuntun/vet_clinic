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


module.exports.get_doctor_schedule_s = async (doctor_id, date) => {
  var temp = [];
  temp = await Appointment.find({
      doctor_id: doctor_id,
      appointment_time: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
  });
  var appointments = temp;
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
      var animal = await Animal.findOne({_id: appointment.animal_id});
      if (animal){
          appointment.animal_data = animal.breed + " " +  animal.type + " " + animal.name;
          var client = await Client.findOne({_id: animal.client_id});
          appointment.client_data = client.name + " " + client.second_name + " " + client.third_name;
          appointment.client_id = client._id;
          appointment.client_phone = client.phone;
      }
      return appointment;
  })
  var temp_appointments = await Promise.all(appointment_promises);
  const updated_appointments = temp_appointments.sort((a, b) => {
      const [aHour, aMinute] = a.time.split(':').map(Number);
      const [bHour, bMinute] = b.time.split(':').map(Number);
      if (aHour !== bHour) {
          return aHour - bHour;
      } else {
          return aMinute - bMinute;
      }
    });
  return updated_appointments;
}

module.exports.add_schedule_entry_s = async (service_id, doctor_id, appointment_time, date) =>{
  var date = new Date(date);
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const [hours, minutes] = appointment_time.split(':').map(Number);
  const fullAppointmentTime = new Date(dateOnly);
  fullAppointmentTime.setHours(hours);
  fullAppointmentTime.setMinutes(minutes);
  const appointment = new Appointment({ service_id: service_id, doctor_id: doctor_id, appointment_time: fullAppointmentTime, confirmed: false});
  await appointment.save();
  return appointment;
}

module.exports.delete_appointment_by_id_s = async (appointment_id) => {
  const deletedAppointment = await Appointment.findByIdAndDelete(appointment_id);
  return deletedAppointment;
}

module.exports.make_appointment_s = async (animal_id, confirmed, appointment_id) =>{
  const updatedAppointment = await Appointment.findOneAndUpdate(
    { _id: appointment_id },
    { $set: { animal_id: animal_id, confirmed: confirmed } },
    { new: true }
  );
  return updatedAppointment;
}

module.exports.get_bookings_s = async (date, confirmed) =>{
  var temp = await Appointment.find({
      appointment_time: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
      animal_id: { $exists: true },
      confirmed: confirmed,
      animal_card_page_id:  { $exists: false},
  });
  var appointments = temp;
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
       const [aHour, aMinute] = a.time.split(':').map(Number);
       const [bHour, bMinute] = b.time.split(':').map(Number);
       if (aHour !== bHour) {
           return bHour - aHour;
       } else {
           return  bMinute - aMinute;
       }
  });
  return updated_appointments;
}

module.exports.approve_appointment_s = async (appointment_id) =>{
  const updatedAppointment = await Appointment.findOneAndUpdate(
    { _id: appointment_id },
    { $set: { confirmed: true } },
    { new: true }
  );
  return updatedAppointment;
}

module.exports.decline_appointment_s = async (appointment_id) =>{
  const updatedAppointment = await Appointment.findOneAndUpdate(
    { _id: appointment_id },
    { $unset: { animal_id: '' } },
    { new: true }
  );
  return updatedAppointment;
}

module.exports.cancel_appointment_s = async (appointment_id) =>{
  const updatedAppointment = await Appointment.findOneAndUpdate(
    { _id: appointment_id },
    { $unset: { animal_id: '' } },
    { $set: { confirmed: false } },
    { new: true }
  );
}

module.exports.start_appointment_s = async (appointment_id, card_page_id) =>{
  var updated_app = await Appointment.findOneAndUpdate(
    { _id: appointment_id },
    { $set: { animal_card_page_id: card_page_id } },
    { new: true }
  );
  return updated_app;
}

module.exports.finish_appointment_s = async (page_id) =>{
  const updatedpage = await AnimalCardPage.findOneAndUpdate(
    { _id: page_id },
    { $set: { finished: true } },
    { new: true }
  );
  return updatedpage;
}

module.exports.get_appointment_by_id_s = async (appointment_id) =>{
  var appointment = await Appointment.findOne({_id: appointment_id});
  return appointment;
}

module.exports.get_client_appointments_s = async (client_id, date) =>{
  var animals = await Animal.find({client_id: client_id});
  var animalIds = animals.map(animal => animal._id);
  var appointments = await Appointment.find({
      animal_card_page_id:  { $exists: false},
      animal_id: { $in: animalIds },
      appointment_time: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) 
  }})
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
        const [aHour, aMinute] = a.time.split(':').map(Number);
        const [bHour, bMinute] = b.time.split(':').map(Number);
        if (aHour !== bHour) {
            return bHour - aHour;
        } else {
            return  bMinute - aMinute;
        }
  });
  return updated_appointments;
}