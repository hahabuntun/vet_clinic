const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const SymptomSchema = mongoose.Schema(
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

const Symptom = mongoose.model("Symptom", SymptomSchema);
module.exports = Symptom;