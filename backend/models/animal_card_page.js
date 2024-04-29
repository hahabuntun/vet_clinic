const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const AnimalCardSchema = mongoose.Schema(
    {
        
        appointment_id: {
            type: String,
            required: true
        },
        animal_id: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const AnimalCard = mongoose.model("AnimalCard", AnimalCardSchema);
module.exports = AnimalCard;