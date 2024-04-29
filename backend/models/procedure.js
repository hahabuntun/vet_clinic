const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const ProcedureSchema = mongoose.Schema(
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

const Procedure = mongoose.model("Procedure", ProcedureSchema);
module.exports = Procedure;