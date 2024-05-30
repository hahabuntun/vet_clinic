const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const AnimalSchema = mongoose.Schema(
    {
        name:{type: String,required: true,},
        type:{type: String,required: true,},
        breed: {type: String,required: false},
        animal_passport:{type: String,required: true,},
        age:{type: Number,required: true,},
        client_id: {type: String,required: true},
    },
    {timestamps: true}
);
const Animal = mongoose.model("Animal", AnimalSchema);
module.exports = Animal;