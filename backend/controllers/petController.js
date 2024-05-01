const mongoose = require("mongoose");
const path = require('path');

const Client = require("../models/client.js");
const Animal = require("../models/animal.js");




module.exports.add_pet_to_client = async (req, res) => {
    try {
      const clientId = req.params.clientId;
      const petData = req.body;
      petData.client_id = clientId; // Assign the client ID to the pet
  
      const newPet = new Animal(petData);
      await newPet.save();
  
      res.status(201).json({ message: 'Pet added successfully', pet: newPet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add pet' });
    }
  }

module.exports.edit_client_pet = async (req, res) => {
    try {
      const petId = req.params.petId;
      const updates = req.body;
  
      const updatedPet = await Animal.findByIdAndUpdate(petId, updates, { new: true });
  
      if (!updatedPet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
  
      res.json({ message: 'Pet updated successfully', pet: updatedPet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update pet' });
    }
  }


module.exports.delete_client_pet = async (req, res) => {
    try {
      const petId = req.params.petId;
  
      const deletedPet = await Animal.findByIdAndDelete(petId);
  
      if (!deletedPet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
  
      res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete pet' });
    }
  }

module.exports.get_all_client_pets = async (req, res) => {
    try {
      const clientId = req.params.clientId;
      
      const pets = await Animal.find({ client_id: clientId });
      console.log(pets);
      const client = await Client.find({ _id: clientId })
      data = { client: client[0], pets: pets };
      
      res.render(path.join('clinic_administation_views', 'client'), data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve pets' });
    }
  }