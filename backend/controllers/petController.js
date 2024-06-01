const mongoose = require("mongoose");
const path = require('path');

const {find_animals_by_query_s, get_animal_by_animal_passport_s, get_animal_by_id_s, get_animals_by_query_s, add_animal_s, update_pet_s, delete_pet_s} = require("../services/petService.js");
const {get_client_by_id_s} = require("../services/clientService.js");
const {get_doctor_by_id_s} = require("../services/workerService.js");
const {get_animal_appointments_s, get_appointment_by_id_and_add_client_s} = require("../services/appointmentService.js");
const {get_page_by_id_s} = require("../services/animalCardPageService.js");

module.exports.add_pet_to_client= async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    const { type, breed, name, animal_passport, age, client_id } = data;
    const qanimal = await get_animal_by_animal_passport_s(animal_passport);
    if (qanimal)
    {
      return res.status(400).json({"message": "animal with this passport already exists"})
    }
    const animal = await add_animal_s(type, breed, name, animal_passport, age, client_id);
    res.status(201).json({ _id: animal._id, name: animal.name, breed: animal.breed, type: animal.type, age: animal.age, animal_passport: animal.animal_passport});
  } catch (error) {
  res.status(500).json({ error: 'Addition of animal failed' });
  }
};
module.exports.edit_client_pet = async (req, res) => {
  try {
    const updates = JSON.parse(JSON.stringify(req.body));
    const pet = await get_animal_by_animal_passport_s(updates.animal_passport);
    if (pet && pet._id != req.params.petId){
      return  res.status(400).json({ message: 'Pet with this passport already exists' });
    }
    const updatedPet = await update_pet_s(req.params.petId, updates);
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
    const deletedPet = await delete_pet_s(petId);
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
    var pets = await get_animals_by_query_s(query);
    const client = await get_client_by_id_s(clientId);
    var data = { client: client, pets: pets };
    res.render(path.join('clinic_administation_views', 'client'), data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve pets' });
  }
}
module.exports.find_animal_page = async (req, res) => {
  try{
    var {doctor_id, animal_id} = req.params;
    var doctor = await get_doctor_by_id_s(doctor_id);
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
    var user_type = "doctor";
    var doctor = await get_doctor_by_id_s(doctor_id);
    var animal = await get_animal_by_id_s(pet_id);
    var client = await get_client_by_id_s(animal.client_id);
    var appointments = await get_animal_appointments_s(animal._id, true);
    var data = {
      client: client,
      user_type: user_type,
      doctor: doctor,
      animal: animal,
      appointments: appointments
    }
    res.render('animal_card', data);
  }catch(error){
    console.log(error);
    res.status(500).json({error: error});
  }
}
module.exports.get_client_animal_card_view = async (req, res) => {
  try{
    var {client_id, pet_id} = req.params;
    var user_type = "client";
    var animal = await get_animal_by_id_s(pet_id);
    var client = await get_client_by_id_s(animal.client_id);
    var appointments = await get_animal_appointments_s(animal._id, true);
    var data = {
      user_type: user_type,
      client: client,
      animal: animal,
      appointments: appointments
    }
    res.render('animal_card', data);
  }catch(error){
    console.log(error);
    res.status(500).json({error: error});
  }
}
module.exports.get_animal_card_page = async (req, res) => {
  try{
    var {doctor_id, pet_id, page_id} = req.params;
    var doctor = await get_doctor_by_id_s(doctor_id);
    var animal = await get_animal_by_id_s(pet_id);
    var client = await get_client_by_id_s(animal.client_id);
    var animal_card_page = await get_page_by_id_s(page_id);
    var appointment = await get_appointment_by_id_and_add_client_s(animal_card_page.appointment_id, client);
    var animal_doctor = await get_doctor_by_id_s(appointment.doctor_id);
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
    var client = await get_client_by_id_s(client_id);
    var animal = await get_animal_by_id_s(pet_id);
    var animal_card_page = await get_page_by_id_s(page_id);
    var appointment = await get_appointment_by_id_and_add_client_s(animal_card_page.appointment_id, client);
    var animal_doctor = await get_doctor_by_id_s(appointment.doctor_id);
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
    var animals = await find_animals_by_query_s(req.query);
    return res.status(200).json({animals: animals});
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Failed to find pets' });
  }
}


