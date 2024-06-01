const mongoose = require("mongoose");
const path = require('path');

const {add_symptom_s, get_symptom_by_card_page_id_s} = require("../services/symptomService.js");

module.exports.get_appoinment_symptoms = async (req, res) =>{
    try{
        const {page_id} = req.params;
        var data = await get_symptom_by_card_page_id_s(page_id);
        return res.status(200).json(data);
    }catch(error){
        res.status(500).json({error: error})
    }
}

module.exports.add_symptom = async (req, res) => {
    try{
        const {name} = JSON.parse(JSON.stringify(req.body));
        const {page_id} = req.params;
        const symptom = await add_symptom_s(name, page_id);
        return res.status(201).json({symptom: symptom});
    }catch(error){
        res.status(500).json({error: error});
    }
}