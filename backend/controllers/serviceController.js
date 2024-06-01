const mongoose = require("mongoose");
const path = require('path');
const {get_service_by_name_s, add_service_s, update_service_s, delete_service_s, get_all_services_s} = require("../services/serviceService.js");


module.exports.add_service = async (req, res) => {
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const { name, price } = data;
        const serv = await get_service_by_name_s(name);
        if (serv){
          return  res.status(400).json({ message: 'Service with this name already exists' });
        }
        var newService = await add_service_s(name, price);
        res.status(201).json({ message: 'Service added successfully', service: newService });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add service' });
      }
};
module.exports.edit_service = async (req, res) => {
  try {
    const updates = JSON.parse(JSON.stringify(req.body));
    const serv = await get_service_by_name_s(updates.name);
    if (serv && serv._id != req.params.serviceId){
      return  res.status(400).json({ message: 'Service with this name already exists' });
    }
    const updatedService = await update_service_s(req.params.serviceId, updates);
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
    const deletedService = await delete_service_s(serviceId);
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
    const data = await get_all_services_s(qdata);
    res.render(path.join('system_administration_views', 'services'), data);
};