const mongoose = require("mongoose");
const path = require('path');

const {add_procedure_s, get_procedure_by_card_page_id_s} = require("../services/procedureService.js");


module.exports.get_appoinment_procedures = async (req, res) =>{
    try{
      const {page_id} = req.params;
      var data = await get_procedure_by_card_page_id_s(page_id);
      return res.status(200).json(data);
    }catch(error){
      res.status(500).json({error: error})
    }
}

module.exports.add_procedure = async (req, res) => {
    try{
        const {name} = JSON.parse(JSON.stringify(req.body));
        const {page_id} = req.params;
        const procedure = await add_procedure_s(name, page_id);
        return res.status(201).json({procedure: procedure});
    }catch(error){
        res.status(500).json({error: error});
        console.log(error);
    }
}