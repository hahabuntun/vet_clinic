const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const AnimalCardPageSchema = mongoose.Schema(
    {
        appointment_id: {type: String,required: true},
        animal_id: {type: String,required: true},
        finished: {type: Boolean,default: false}
    },
    {timestamps: true}
);
const AnimalCardPage = mongoose.model("AnimalCardPage", AnimalCardPageSchema);
module.exports = AnimalCardPage;