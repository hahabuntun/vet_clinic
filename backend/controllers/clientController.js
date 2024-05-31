const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const path = require('path');

const Client = require("../models/client.js");
const Animal = require("../models/animal.js");


module.exports.get_all_clients  = async (req, res) => {
    const qdata = req.query;
    var query = {};
    if (qdata){
      if(qdata.name && qdata.name != ""){
        query.name = qdata.name;
      }
      if (qdata.second_name && qdata.second_name != ""){
        query.second_name = qdata.second_name;
      }
      if (qdata.third_name && qdata.third_name != ""){
        query.third_name = qdata.third_name;
      }
      if (qdata.email && qdata.email != ""){
        query.email = qdata.email;
      }
      if (qdata.phone && qdata.phone != ""){
        query.phone = qdata.phone;
      }
      if (qdata.passport && qdata.passport != ""){
        query.passport = qdata.passport;
      }
    }
    const clients = await Client.find(query);
    data = {
        clients: clients
    }
    res.render(path.join('clinic_administation_views', 'clients'), data);
};


module.exports.edit_client = async (req, res) => {
    try {
      const updates = JSON.parse(JSON.stringify(req.body));
      const cli = await Client.findOne({passport: updates.passport});
      if (cli && cli._id != req.params.clientId){
        return  res.status(400).json({ message: 'Client with this passport already exists' });
      }
      const updatedClient = await Client.findOneAndUpdate(
        { _id: req.params.clientId },
        { $set: updates },
        { new: true }
    );
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json({ email: updatedClient.email, name: updatedClient.name,
        second_name: updatedClient.second_name, third_name: updatedClient.third_name,
        phone: updatedClient.phone, passport: updatedClient.passport, _id: updatedClient._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update client' });
    }
}
module.exports.delete_client = async (req, res) => {
    try {
      const clientId = req.params.clientId;
      const deletedClient = await Client.findByIdAndDelete(clientId);
      if (!deletedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json({ message: 'Client deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete client' });
    }
}
module.exports.add_client = async (req, res) => {
    try {
      const data = JSON.parse(JSON.stringify(req.body));
      const { email, password, name, second_name, third_name, phone, passport } = data;
      const qclient = await Client.findOne({passport: passport});
      if (qclient)
      {
        return res.status(400).json({"message": "client with this passport already exists"})
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const client = new Client({ email: email, password: hashedPassword, name: name,
                                second_name: second_name, third_name: third_name,
                                phone: phone, passport: passport });
      await client.save();
      res.status(201).json({ email: client.email, name: client.name,
        second_name: client.second_name, third_name: client.third_name,
        phone: client.phone, passport: client.passport, _id: client._id });
    } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
    }
};
module.exports.get_client = async (req, res) => {
  try{
    const { passport } = req.params;
    const client = await Client.findOne({ passport });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    const pets = await Animal.find({client_id: client._id});
    client.pets = pets;
    res.status(200).json(client);
  }
  catch(error)
  {
    res.status(500).json({ error: 'could not find client' });
  }
}
module.exports.get_main_page = async (req, res) => {
  try{
    const clientId = req.params.clientId;
    const qdata = req.query;
    var query = {}
    if (qdata){
      if (qdata.name && qdata.name != ""){
        query.name = qdata.name;
      }
      if (qdata.breed && qdata.breed != ""){
        query.breed = qdata.breed;
      }
      if (qdata.type && qdata.type != ""){
        query.type = qdata.type;
      }
      if (qdata.animal_passport && qdata.animal_passport != ""){
        query.animal_passport = qdata.animal_passport;
      }
      if (qdata.age && qdata.age != ""){
        query.age = qdata.age;
      }
    }
    query.client_id = clientId;
    var pets = await Animal.find(  query );
    var client = await Client.findOne({_id: clientId});
    var data = {
      pets: pets,
      client: client
    }
    res.render(path.join('client_views', 'main'), data);
  }catch(error){
    console.log(error);
    res.status(500).json({error: error});
  }
}