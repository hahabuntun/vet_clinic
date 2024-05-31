const mongoose = require("mongoose");
const path = require('path');

const Client = require("../models/client.js");
const Animal = require("../models/animal.js");
const Worker = require("../models/worker.js");
var AnimalCardPage = require("../models/animal_card_page.js");
var Analysis = require("../models/analysis_result.js");
const Appointment = require("../models/appointment.js");
const Service = require("../models/service.js");
const Symptom = require("../models/symptom.js");
const Diagnosis = require("../models/diagnosis.js");
const Procedure = require("../models/procedure.js");


module.exports.add_pet_to_client= async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    const { type, breed, name, animal_passport, age, client_id } = data;
    const qanimal = await Animal.findOne({animal_passport: animal_passport});
    if (qanimal)
    {
      return res.status(400).json({"message": "animal with this passport already exists"})
    }
    const animal = new Animal({ type: type, breed: breed, name: name,
                              age: age, client_id: client_id, animal_passport: animal_passport });
    await animal.save();
    res.status(201).json({ _id: animal._id, name: animal.name, breed: animal.breed, type: animal.type, age: animal.age, animal_passport: animal.animal_passport});
  } catch (error) {
  res.status(500).json({ error: 'Addition of animal failed' });
  }
  };
module.exports.edit_client_pet = async (req, res) => {
  try {
    const updates = JSON.parse(JSON.stringify(req.body));
    const pet = await Animal.findOne({animal_passport: updates.animal_passport});
    
    if (pet && pet._id != req.params.petId){
      return  res.status(400).json({ message: 'Pet with this passport already exists' });
    }
    const updatedPet = await Animal.findOneAndUpdate(
      { _id: req.params.petId },
      { $set: updates },
      { new: true }
  );

    if (!updatedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json({ _id: updatedPet._id, name: updatedPet.name, type: updatedPet.type, breed: updatedPet.breed, age: updatedPet.age, animal_passport: updatedPet.animal_passport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update pet' });
  }
}
module.exports.delete_client_pet = async (req, res) => {
  try {
    const petId = req.params.petId;
    const deletedPet = await Animal.findByIdAndDelete(petId);
    if (!deletedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete pet' });
  }
}
module.exports.get_all_client_pets = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const qdata = req.query;
    var query = {}
    if (qdata){
      if (qdata.name && qdata.name != ""){
        query.name = qdata.name;
      }
      if (qdata.breed && qdata.breed != ""){
        query.breed = qdata.breed;
      }
      if (qdata.type && qdata.type != ""){
        query.type = qdata.type;
      }
      if (qdata.animal_passport && qdata.animal_passport != ""){
        query.animal_passport = qdata.animal_passport;
      }
      if (qdata.age && qdata.age != ""){
        query.age = qdata.age;
      }
    }
    query.client_id = clientId;
    var pets = await Animal.find(  query );
    const client = await Client.find({ _id: clientId })
    data = { client: client[0], pets: pets };
    res.render(path.join('clinic_administation_views', 'client'), data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve pets' });
  }
}
module.exports.find_animal_page = async (req, res) => {
  try{
    var {doctor_id, animal_id} = req.params;
    var doctor = await Worker.findOne({_id: doctor_id});
    var data = {
      doctor: doctor
    }
    res.render(path.join('doctor_views', 'animal_find'), data);
  }
  catch(error)
  {
    res.status(500).json({ message: 'Failed to retrieve pet data' });
    console.log(error);
  }
}
module.exports.get_animal_card_view = async (req, res) => {
  try{
    var {doctor_id, pet_id} = req.params;
    var doctor = await Worker.findOne({_id: doctor_id});
    var animal = await Animal.findOne({_id: pet_id});
    var appointments = await Appointment.find({animal_id: animal._id, animal_card_page_id:  { $exists: true}});
    const appointment_promises = appointments.map(async (appointment) => {
        var animal_card_page = await AnimalCardPage.find({_id: appointment.animal_card_page_id});
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
        return appointment;
    })
    var temp_appointments = await Promise.all(appointment_promises);
    console.log(temp_appointments);
    var data = {
      doctor: doctor,
      animal: animal,
      appointments: temp_appointments
    }
    res.render(path.join('doctor_views', 'animal_card'), data);
  }catch(error){
    res.status(500).json({error: error});
  }
}

module.exports.get_client_animal_card_view = async (req, res) => {
  try{
    var {client_id, pet_id} = req.params;
    var client = await Client.findOne({_id: client_id});
    var animal = await Animal.findOne({_id: pet_id});
    var appointments = await Appointment.find({animal_id: animal._id, animal_card_page_id:  { $exists: true}});
    const appointment_promises = appointments.map(async (appointment) => {
        var animal_card_page = await AnimalCardPage.find({_id: appointment.animal_card_page_id});
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
        return appointment;
    })
    var temp_appointments = await Promise.all(appointment_promises);
    console.log(temp_appointments);
    var data = {
      client: client,
      animal: animal,
      appointments: temp_appointments
    }
    res.render(path.join('client_views', 'animal_card'), data);
  }catch(error){
    res.status(500).json({error: error});
  }
}


module.exports.get_appoinment_diagnosis = async (req, res) =>{
  try{
    const {page_id} = req.params;
    var diagnosises = await Diagnosis.find({animal_card_page_id: page_id});
    var data = {
      diagnosises: diagnosises,
    }
    return res.status(200).json(data);
  }
  catch(error){
    res.status(500).json({error: error})
  }
}
module.exports.get_appoinment_symptoms = async (req, res) =>{
  try{
    const {page_id} = req.params;
    var symptoms = await Symptom.find({animal_card_page_id: page_id});
    var data = {
      symptoms: symptoms,
    }
    return res.status(200).json(data);
  }catch(error){
    res.status(500).json({error: error})
  }
}
module.exports.get_appoinment_procedures = async (req, res) =>{
  try{
    const {page_id} = req.params;
    var procedures = await Procedure.find({animal_card_page_id: page_id});
    var data = {
      procedures: procedures,
    }
    return res.status(200).json(data);
  }catch(error){
    res.status(500).json({error: error})
  }
}
module.exports.get_animal_card_page = async (req, res) => {
  try{
    var {doctor_id, pet_id, page_id} = req.params;
    var doctor = await Worker.findOne({_id: doctor_id});
    var animal = await Animal.findOne({_id: pet_id});
    var animal_card_page = await AnimalCardPage.findOne({_id: page_id});
    var appointment = await Appointment.findOne({_id: animal_card_page.appointment_id});
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
    var animal_doctor = await Worker.findOne({_id: appointment.doctor_id});
    var data = {
      doctor: doctor,
      animal: animal,
      animal_doctor: animal_doctor,
      appointment: appointment
    }
    res.render(path.join('doctor_views', 'single_appointment'), data);
  }catch(error)
  {
    res.status(500).json({error: error});
  }
}


module.exports.get_client_animal_card_page = async (req, res) => {
  try{
    var {client_id, pet_id, page_id} = req.params;
    var client = await Client.findOne({_id: client_id});
    var animal = await Animal.findOne({_id: pet_id});
    var animal_card_page = await AnimalCardPage.findOne({_id: page_id});
    var appointment = await Appointment.findOne({_id: animal_card_page.appointment_id});
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
    var animal_doctor = await Worker.findOne({_id: appointment.doctor_id});
    var data = {
      client: client,
      animal: animal,
      animal_doctor: animal_doctor,
      appointment: appointment
    }
    res.render(path.join('client_views', 'card_page'), data);
  }catch(error)
  {
    res.status(500).json({error: error});
  }
}

module.exports.find_animals = async (req, res) => {
  try{
    const {search_type, email, passport, phone, name, breed, type, animal_passport} = req.query;
    console.log(req.query);
    var animals = [];
    if(search_type == "client")
    {
      var query = {};
      if (email && email != "") {
        query.email = email;
      }
      if (passport && passwport != "") {
        query.passport = passport;
      }
      if (phone && phone != "") {
        query.phone = phone;
      }
      var clients = await Client.find(query);
      var clientPromises = [];
      for (const client of clients) {
        clientPromises = clientPromises.concat(await Animal.find({ client_id: client._id }));
      }
      animals = await Promise.all(clientPromises);
      console.log(animals);
    }
    else{
      const animalQuery = {};
      if (name && name != "") {
        animalQuery.name = name;
      }
      if (breed && breed != "") {
        animalQuery.breed = breed;
      }
      if (type && type != "") {
        animalQuery.type = type;
      }
      if (animal_passport & animal_passport != "") {
        animalQuery.animal_passport = animal_passport;
      }
      console.log(animalQuery);
      animals = await Animal.find(animalQuery);
    }
    return res.status(200).json({animals: animals});
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Failed to find pets' });
  }
}
module.exports.add_procedure = async (req, res) => {
  try{
    const {name} = JSON.parse(JSON.stringify(req.body));
    const {page_id} = req.params;
    const procedure = new Procedure({name: name, animal_card_page_id: page_id});
    await procedure.save();
    return res.status(201).json({procedure: procedure});
  }catch(error){
    res.status(500).json({error: error});
    console.log(error);
  }
}
module.exports.add_symptom = async (req, res) => {
  try{
    const {name} = JSON.parse(JSON.stringify(req.body));
    const {page_id} = req.params;
    const symptom = new Symptom({name: name, animal_card_page_id: page_id});
    await symptom.save();
    return res.status(201).json({symptom: symptom});
  }catch(error){
    res.status(500).json({error: error});
  }
}
module.exports.add_diagnosis = async (req, res) => {
  try{
    const {name} = JSON.parse(JSON.stringify(req.body));
    const {page_id} = req.params;
    const diagnosis = new Diagnosis({name: name, animal_card_page_id: page_id});
    await diagnosis.save();
    return res.status(201).json({diagnosis: diagnosis});
  }catch(error){
    res.status(500).json({error: error});
  }
}