const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const path = require('path');
const {get_all_workers_s, get_worker_by_passport_s, update_worker_s, delete_worker_s, add_worker_s, get_doctor_by_id_s} = require("../services/workerService.js")


module.exports.get_all_workers  = async (req, res) => {
    const qdata = req.query;
    var data = await get_all_workers_s( qdata);
    res.render(path.join('system_administration_views', 'employees'), data);
};
module.exports.edit_worker = async (req, res) => {
    try {
      const updates = JSON.parse(JSON.stringify(req.body));
      const work = await get_worker_by_passport_s(updates.passport);
      if (work && work._id != req.params.workerId){
        return  res.status(400).json({ message: 'Worker with this passport already exists' });
      }
      const updatedWorker = await update_worker_s(req.params.workerId, updates);
      if (!updatedWorker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
      res.json({ message: 'Worker updated successfully', worker: updatedWorker });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update worker' });
    }
}
module.exports.delete_worker = async (req, res) => {
    try {
      const workerId = req.params.workerId;
      const deletedWorker = await delete_worker_s(workerId);
      if (!deletedWorker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
      res.json({ message: 'Worker deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete worker' });
    }
}
module.exports.add_worker =  async (req, res) => {
    try {

      const data = JSON.parse(JSON.stringify(req.body));
      const { email, password, name, second_name, third_name, phone, passport, type } = data;
      const qworker = await get_worker_by_passport_s(passport);
      if (qworker)
      {
        return res.status(400).json({"message": "employee with this passport already exists"})
      }
      await add_worker_s(email, password, name, second_name, third_name, phone, passport, type);
      res.status(201).json({ message: 'Worker registered successfully' });
    } catch (error) {
        console.log(error)
    res.status(500).json({ error: 'Registration failed' });
    }
};
module.exports.get_single_doctor_shedule_page = async (req, res) =>{
  try{
    var {doctor_id} = req.params;
    var doctor = await get_doctor_by_id_s(doctor_id);
    var data = {
      doctor: doctor
    }
    res.render(path.join('doctor_views', 'single_doctor_schedule'), data);
  }catch(error){
    res.status(500).json({ error: 'could not return page' });
  }
}
module.exports.get_doctor_appointments_page = async (req, res) => {
  try{
    var {doctor_id} = req.params;
    var doctor = await get_doctor_by_id_s(doctor_id);
    var data = {
      doctor: doctor
    }
    res.render(path.join('doctor_views', 'appointments'), data);
  }
  catch(error){
    res.status(500).json({ error: 'could not return page' });
  }

}