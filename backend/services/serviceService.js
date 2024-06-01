const mongoose = require("mongoose");
const path = require('path');

const Service = require("../models/service.js");

module.exports.get_service_by_name_s = async (name) =>{
    const serv = await Service.findOne({name: name});
    return serv;
}

module.exports.add_service_s = async (name, price) =>{
    const newService = new Service({
        name: name,
        price: price
      });
      await newService.save();
      return newService
}

module.exports.update_service_s = async (service_id, updates) =>{
    const updatedService = await Service.findOneAndUpdate(
        { _id: service_id },
        { $set: updates },
        { new: true }
    );
    return updatedService;
}

module.exports.delete_service_s = async (service_id) =>{
    const deletedService = await Service.findByIdAndDelete(service_id);
    return deletedService;
}

module.exports.get_all_services_s = async (qdata) =>{
    const services = await Service.find(qdata);
    const data = {
        services: services
    }
    return data;
}

module.exports.get_all_services_without_params_s = async () =>{
    const services = await Service.find();
    return services;
}