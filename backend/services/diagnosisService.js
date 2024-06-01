const mongoose = require("mongoose");
const path = require('path');

const Diagnosis = require("../models/diagnosis.js");

module.exports.get_diagnosis_by_card_page_id_s = async (card_page_id) =>{
    var diagnosises = await Diagnosis.find({animal_card_page_id: card_page_id});
    var data = {
      diagnosises: diagnosises,
    }
    return data;
}

module.exports.add_diagnosis_s = async (diagnosis_name, card_page_id) =>{
    const diagnosis = new Diagnosis({name: diagnosis_name, animal_card_page_id: card_page_id});
    await diagnosis.save();
    return diagnosis;
}