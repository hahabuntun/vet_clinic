const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const path = require('path');

const Worker = require("../models/worker.js");


module.exports.get_all_workers  = async (req, res) => {
    const employees = await Worker.find({  });
    data = {
        employees: employees
    }
    res.render(path.join('system_administration_views', 'employees'), data);
};



module.exports.edit_worker = async (req, res) => {
    try {
      const workerId = req.params.workerId;
      const updates = req.body;
  
      // Find the worker by ID and update with the provided data
      const updatedWorker = await Worker.findByIdAndUpdate(workerId, updates, { new: true });
  
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
  
      // Find the worker by ID and delete it
      const deletedWorker = await Worker.findByIdAndDelete(workerId);
  
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
      const { email, password, name, second_name, third_name, phone, passport, type } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const worker = new Worker({ email: email, password: hashedPassword, name: name,
                                second_name: second_name, third_name: third_name,
                                phone: phone, passport: passport, type: type });
      await worker.save();
      res.status(201).json({ message: 'Worker registered successfully' });
    } catch (error) {
        console.log(error)
    res.status(500).json({ error: 'Registration failed' });
    }
    };