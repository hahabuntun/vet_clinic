const mongoose = require("mongoose");

const bcrypt = require('bcrypt');


const Client = require("../models/client.js");




module.exports.get_all_clients  = async (req, res) => {
    const clients = await Client.find({  });
    data = {
        clients: clients
    }
    res.render(path.join('clinic_administration_views', 'clients'), data);
};


module.exports.edit_client = async (req, res) => {
    try {
      const clientId = req.params.clientId;
      const updates = req.body;
  
      const updatedClient = await Client.findByIdAndUpdate(clientId, updates, { new: true });
  
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
      const { email, password, name, second_name, third_name, phone, passport } = req.body;
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