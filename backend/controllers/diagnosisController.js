const mongoose = require("mongoose");
const path = require('path');

const {add_diagnosis_s, get_diagnosis_by_card_page_id_s} = require("../services/diagnosisService.js");

module.exports.get_appoinment_diagnosis = async (req, res) =>{
    try{
      const {page_id} = req.params;
      var data = await get_diagnosis_by_card_page_id_s(page_id);
      return res.status(200).json(data);
    }
    catch(error){
      res.status(500).json({error: error})
    }
}
module.exports.add_diagnosis = async (req, res) => {
    try{
        const {name} = JSON.parse(JSON.stringify(req.body));
        const {page_id} = req.params;
        const diagnosis = await add_diagnosis_s(name, page_id);
        return res.status(201).json({diagnosis: diagnosis});
    }catch(error){
        res.status(500).json({error: error});
    }
}