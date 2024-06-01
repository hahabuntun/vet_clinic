const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const path = require('path');

const Worker = require("../models/worker.js");


module.exports.get_all_workers_s = async (qdata) => {
    const employees = await Worker.find(qdata);
    data = {
        employees: employees
    }
    return data;
}
module.exports.get_all_doctors_s = async () =>{
    var doctors = await Worker.find({type: "doctor"});
    return doctors;
}

module.exports.get_worker_by_passport_s = async (passport) => {
    const work = await Worker.findOne({passport: passport});
    return work;
}
module.exports.get_worker_by_email_s = async (email) => {
    const worker = await Worker.findOne({ email });
    return worker;
}

module.exports.get_doctor_by_id_s = async (doctor_id) =>{
    const doctor = await Worker.findOne({_id: doctor_id});
    return doctor;
}

module.exports.update_worker_s = async (worker_id, updates) => {
    const updatedWorker = await Worker.findOneAndUpdate(
        { _id: worker_id },
        { $set: updates },
        { new: true }
    );
    return updatedWorker;
}

module.exports.delete_worker_s = async (worker_id) => {
    const deletedWorker = await Worker.findByIdAndDelete(worker_id);
    return deletedWorker;
}

module.exports.add_worker_s = async (email, password, name, second_name, third_name, phone, passport, type) =>{
    const hashedPassword = await bcrypt.hash(password, 10);
    const worker = new Worker({ email: email, password: hashedPassword, name: name,
                              second_name: second_name, third_name: third_name,
                              phone: phone, passport: passport, type: type });
    await worker.save();
}
