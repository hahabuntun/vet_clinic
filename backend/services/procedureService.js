const mongoose = require("mongoose");
const path = require('path');

const Procedure = require("../models/procedure.js");

module.exports.get_procedure_by_card_page_id_s = async (card_page_id) =>{
    var procedures = await Procedure.find({animal_card_page_id: card_page_id});
    var data = {
      procedures: procedures,
    }
    return data;
}

module.exports.add_procedure_s = async (procedure_name, card_page_id) =>{
    const procedure = new Procedure({name: procedure_name, animal_card_page_id: card_page_id});
    await procedure.save();
    return procedure;
}