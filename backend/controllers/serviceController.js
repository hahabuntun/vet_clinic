const mongoose = require("mongoose");
const path = require('path');

const Service = require("../models/service.js");




module.exports.add_service = async (req, res) => {
    try {
        // Get the service data from the request body
        const { name, price } = req.body;
    
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
    const serviceId = req.params.serviceId;
    const updates = req.body;

    // Find the service by ID and update with provided data
    const updatedService = await Service.findByIdAndUpdate(serviceId, updates, { new: true });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully', service: updatedService });
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

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete service' });
  }
}

module.exports.get_all_services = async (req, res) => {
    const services = await Service.find({  });
    data = {
        services: services
    }
    res.render(path.join('system_administration_views', 'services'), data);
};