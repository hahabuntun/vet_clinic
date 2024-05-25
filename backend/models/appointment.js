const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema(
    {
        doctor_id: {
            type: String,
            required: true
        },
        service_id: {
            type: String,
            required: true
        },
        animal_id: {
            type: String,
            required: false
        },
        appointment_time: {
            type: Date,
            required: true
        },
        confirmed: {
            type: Boolean,
            required: true
        },
        service_name: {type: String},
        time: {type: String}
    },
    {
        timestamps: true
    }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;