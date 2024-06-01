const mongoose = require("mongoose");
const path = require('path');
const Symptom = require("../models/symptom.js");


module.exports.get_symptom_by_card_page_id_s = async (card_page_id) =>{
    var symptoms = await Symptom.find({animal_card_page_id: card_page_id});
    var data = {
      symptoms: symptoms,
    }
    return data;
}

module.exports.add_symptom_s = async (symptom_name, card_page_id) =>{
    const symptom = new Symptom({name: symptom_name, animal_card_page_id: card_page_id});
    await symptom.save();
    return symptom;
}