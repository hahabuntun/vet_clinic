const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const ClientSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        second_name:{
            type: String,
            required: true,
        },
        third_name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        phone:{
            type: String,
            required: true,
        },
        passport:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
        },
        pets: [],
    },
    {
        timestamps: true
    }
);

const Client = mongoose.model("Client", ClientSchema);
module.exports = Client;