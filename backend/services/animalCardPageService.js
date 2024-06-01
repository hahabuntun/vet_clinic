const mongoose = require("mongoose");
const path = require('path');
const AnimalCardPage = require("../models/animal_card_page.js");


module.exports.get_page_by_id_s = async (page_id) =>{
    var animal_card_page = await AnimalCardPage.findOne({_id: page_id});
    return animal_card_page;
}