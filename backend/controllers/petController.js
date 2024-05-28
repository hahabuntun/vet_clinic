const mongoose = require("mongoose");
const path = require('path');

const Client = require("../models/client.js");
const Animal = require("../models/animal.js");



module.exports.add_pet_to_client= async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body));
    
    const { type, breed, name, animal_passport, age, client_id } = data;
    const qanimal = await Animal.findOne({animal_passport: animal_passport});
    if (qanimal)
    {
      return res.status(400).json({"message": "animal with this passport already exists"})
    }
    
    const animal = new Animal({ type: type, breed: breed, name: name,
                              age: age, client_id: client_id, animal_passport: animal_passport });
    await animal.save();
    
    res.status(201).json({ message: 'Animal added successfully' });
  } catch (error) {
  res.status(500).json({ error: 'Addition of animal failed' });
  }
  };


module.exports.edit_client_pet = async (req, res) => {
  try {
    const updates = JSON.parse(JSON.stringify(req.body));
    const pet = await Animal.findOne({animal_passport: updates.animal_passport});
    
    if (pet && pet._id != req.params.petId){
      return  res.status(400).json({ message: 'Pet with this passport already exists' });
    }
    const updatedPet = await Animal.findOneAndUpdate(
      { _id: req.params.petId }, // Filter by serviceId
      { $set: updates }, // Update with the fields in updates
      { new: true } // Return the updated document
  );

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

    // Find the client by ID and delete it
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
    const qdata = req.query;
    console.log(qdata);
    qdata.client_id = clientId;
    console.log(qdata);
    var pets = await Animal.find(  qdata );
    // if (Object.keys(qdata).length == 0){
    //   pets = await Animal.find({ client_id: clientId });
    // }
    // else{
      
    //   temp_pets = await Animal.find(  qdata );
    //   temp_pets.forEach(pet=>{
    //     if (pet.client_id == clientId){
    //       pets.push(pet);
    //     }
    //   })
    // }
    const client = await Client.find({ _id: clientId })
    data = { client: client[0], pets: pets };
    
    res.render(path.join('clinic_administation_views', 'client'), data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve pets' });
  }
}