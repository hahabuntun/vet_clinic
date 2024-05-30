const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const AnalysisSchema = mongoose.Schema(
    {
        name: {type: String,required: true},
        filepath: {type: String,required: true},
        animal_id: {type: String,required: true},
        analysis_date: {type: Date,required: true},
    },
    {timestamps: true}
);
const Analysis = mongoose.model("Analysis", AnalysisSchema);
module.exports = Analysis;