const mongoose = require("mongoose");
const path = require('path');

const Client = require("../models/client.js");
const Animal = require("../models/animal.js");

module.exports.get_animals_by_client_id_s = async (client_id) =>{
    const pets = await Animal.find({client_id: client_id});
    return pets;
}

module.exports.get_animals_by_query_s = async (query) =>{
    var pets = await Animal.find(  query );
    return pets;
}

module.exports.get_animal_by_animal_passport_s = async (animal_passport) =>{
    const animal = await Animal.findOne({animal_passport: animal_passport});
    return animal;
}

module.exports.get_animal_by_id_s = async (animal_id) => {
    var animal = await Animal.findOne({_id: animal_id});
    return animal;
}

module.exports.add_animal_s = async (type, breed, name, animal_passport, age, client_id) =>{
    var animal = new Animal({ type: type, breed: breed, name: name,
        age: age, client_id: client_id, animal_passport: animal_passport });
    await animal.save();
    return animal;
}

module.exports.update_pet_s = async (pet_id, updates) =>{
    var updatesPet = await Animal.findOneAndUpdate(
        { _id: pet_id },
        { $set: updates },
        { new: true }
    );
    return updatesPet;
}

module.exports.delete_pet_s = async (pet_id) =>{
    const deletedPet = await Animal.findByIdAndDelete(pet_id);
    return deletedPet;
}