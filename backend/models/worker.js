const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const WorkerSchema = mongoose.Schema(
    {
        name:{type: String,required: true,},
        second_name:{type: String,required: true,},
        third_name:{type: String,required: true,},
        email:{type: String,required: true,},
        phone:{type: String,required: true,},
        passport:{type: String,required: true,},
        password:{type: String,required: true,},
        appointments: [],
        type:{type: String,required: true},
    },
    {timestamps: true}
);

const Worker = mongoose.model("Worker", WorkerSchema);
module.exports = Worker;