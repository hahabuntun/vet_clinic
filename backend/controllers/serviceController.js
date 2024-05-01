const mongoose = require("mongoose");

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

module.exports.get_all_services = async (req, res) => {
    const services = await Service.find({  });
    data = {
        services: services
    }
    res.render(path.join('system_administration_views', 'services'), data);
};