const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const path = require('path');

const Client = require("../models/client.js");




module.exports.get_all_clients  = async (req, res) => {
    const qdata = req.query;
    const clients = await Client.find(qdata);
    data = {
        clients: clients
    }
    res.render(path.join('clinic_administation_views', 'clients'), data);
};


module.exports.edit_client = async (req, res) => {
    try {
      const updates = JSON.parse(JSON.stringify(req.body));
      const cli = await Client.findOne({passport: updates.passport});
      console.log(updates);
      if (cli && cli._id != req.params.clientId){
        return  res.status(400).json({ message: 'Client with this passport already exists' });
      }
      const updatedClient = await Client.findOneAndUpdate(
        { _id: req.params.clientId }, // Filter by serviceId
        { $set: updates }, // Update with the fields in updates
        { new: true } // Return the updated document
    );
  
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
  
      res.json({ message: 'Client updated successfully', client: updatedClient });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update client' });
    }
}
module.exports.delete_client = async (req, res) => {
    try {
      const clientId = req.params.clientId;
  
      // Find the client by ID and delete it
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
      console.log(data);
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
      res.status(201).json({ message: 'Client registered successfully' });
    } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
    }
    };