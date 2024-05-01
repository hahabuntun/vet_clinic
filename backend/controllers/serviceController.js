const mongoose = require("mongoose");
const path = require('path');

const Service = require("../models/service.js");




module.exports.add_service = async (req, res) => {
    try {
        // Get the service data from the request body
        const data = JSON.parse(JSON.stringify(req.body));
        const { name, price } = data;
        console.log(data);

        const serv = await Service.findOne({name: name});
        if (serv){
          return  res.status(400).json({ message: 'Service with this name already exists' });
        }
        // Create a new service object
        const newService = new Service({
          name: name,
          price: price
        });
    
        // Save the service to the database
        await newService.save();
    
        // Send a success response
        res.status(201).json({ message: 'Service added successfully', service: newService });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add service' });
      }
};

module.exports.edit_service = async (req, res) => {
  try {
    const updates = JSON.parse(JSON.stringify(req.body));
    const serv = await Service.findOne({name: updates.name});
    console.log(serv)
    if (serv && serv._id != req.params.serviceId){
      return  res.status(400).json({ message: 'Service with this name already exists' });
    }

    // Find the service by ID and update with provided data
    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.serviceId }, // Filter by serviceId
      { $set: updates }, // Update with the fields in updates
      { new: true } // Return the updated document
  );

    //const updatedService = await Service.findByIdAndUpdate(serviceId, {updates}, { new: true });
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

  
    return res.status(200).json({message: "Service updated"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update service' });
  }
}

module.exports.delete_service = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;

    // Find the service by ID and delete it
    const deletedService = await Service.findByIdAndDelete(serviceId);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete service' });
  }
}

module.exports.get_all_services = async (req, res) => {
    const qdata = req.query;
    const services = await Service.find(qdata);
    const data = {
        services: services
    }
    res.render(path.join('system_administration_views', 'services'), data);
};