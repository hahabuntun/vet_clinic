const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const DiagnosisSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        animal_card_page_id: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const Diagnosis = mongoose.model("Diagnosis", DiagnosisSchema);
module.exports = Diagnosis;