const fs = require('fs');
const path = require('path');
const Analysis = require('../models/analysis.js');

module.exports.add_analysis_s = async (name, filepath, animal_id, description) => {
    const analysis_date = new Date();
    const newAnalysis = new Analysis({
      name,
      filepath: filepath,
      animal_id,
      analysis_date,
      description
    });
    await newAnalysis.save();
    return newAnalysis;
};
module.exports.get_analysis_by_id_s = async (analysis_id) =>{
    const analysis = await Analysis.findById(analysis_id);
    return analysis;
}
module.exports.get_analyses_by_animal_id_s = async (animal_id) =>{
    const analyses = await Analysis.find({ animal_id });
    return analyses;
}