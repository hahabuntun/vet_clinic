const mongoose = require("mongoose");
const path = require('path');
const AnimalCardPage = require("../models/animal_card_page.js");


module.exports.get_page_by_id_s = async (page_id) =>{
    var animal_card_page = await AnimalCardPage.findOne({_id: page_id});
    return animal_card_page;
}

module.exports.add_animal_card_page_s = async (animal_id, appointment_id) => {
    var animal_card_page = new AnimalCardPage({animal_id: animal_id, appointment_id: appointment_id});
    await animal_card_page.save();
    return animal_card_page;
}