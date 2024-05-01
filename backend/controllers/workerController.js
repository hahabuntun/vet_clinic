const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const path = require('path');

const Worker = require("../models/worker.js");


module.exports.get_all_workers  = async (req, res) => {
    const qdata = req.query;
    const employees = await Worker.find(qdata);
    data = {
        employees: employees
    }
    res.render(path.join('system_administration_views', 'employees'), data);
};



module.exports.edit_worker = async (req, res) => {
    try {

      const updates = JSON.parse(JSON.stringify(req.body));
      const work = await Worker.findOne({passport: updates.passport});
      if (work && work._id != req.params.workerId){
        return  res.status(400).json({ message: 'Worker with this passport already exists' });
      }

      const updatedWorker = await Worker.findOneAndUpdate(
        { _id: req.params.workerId }, // Filter by serviceId
        { $set: updates }, // Update with the fields in updates
        { new: true } // Return the updated document
    );
  
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

      const data = JSON.parse(JSON.stringify(req.body));
      console.log(data);
      const { email, password, name, second_name, third_name, phone, passport, type } = data;
      const qworker = await Worker.findOne({passport: passport});
      if (qworker)
      {
        return res.status(400).json({"message": "employee with this passport already exists"})
      }
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