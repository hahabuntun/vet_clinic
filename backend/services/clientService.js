const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const path = require('path');

const Client = require("../models/client.js");


module.exports.get_all_clients_s = async (query) =>{
    const clients = await Client.find(query);
    var data = {
        clients: clients
    }
    return data;
}

module.exports.get_client_by_passport_s = async (passport) =>{
    const cli = await Client.findOne({passport: passport});
    return cli;
}

module.exports.get_client_by_id_s = async (client_id) =>{
    var client = await Client.findOne({_id: client_id});
    return client;
}

module.exports.update_client_s = async (client_id, updates) =>{
    const updatedClient = await Client.findOneAndUpdate(
        { _id: client_id },
        { $set: updates },
        { new: true }
      );
    return updatedClient;
}

module.exports.delete_client_s = async (client_id) =>{
    const deletedClient = await Client.findByIdAndDelete(client_id);
    return deletedClient;
}

module.exports.add_client_s = async (email, password, name, second_name, third_name, phone, passport) =>{
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = new Client({ email: email, password: hashedPassword, name: name,
                            second_name: second_name, third_name: third_name,
                            phone: phone, passport: passport });
    await client.save();
    return client;
}