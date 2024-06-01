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