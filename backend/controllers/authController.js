const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Worker = require("../models/worker.js");
const Client = require("../models/client.js");



module.exports.register_worker =  async (req, res) => {
  try {
    const { email, password, name, second_name, third_name, phone, passport, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const worker = new Worker({ email: email, password: hashedPassword, name: name,
                              second_name: second_name, third_name: third_name,
                              phone: phone, passport: passport, type: type });
    await worker.save();
    res.status(201).json({ message: 'Worker registered successfully' });
  } catch (error) {
  res.status(500).json({ error: 'Registration failed' });
  }
  };


module.exports.register_client = async (req, res) => {
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

module.exports.login_worker = async (req, res) => {
  try {
    const { email, password } = req.body;
    const worker = await Worker.findOne({ email });
    if (!worker) {
    return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, worker.password);
    if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ id: worker._id }, 'your-secret-key', {
    expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
  };


module.exports.login_client = async (req, res) => {
    try {
      const { email, password } = req.body;
      const client = await Client.findOne({ email });
      if (!client) {
      return res.status(401).json({ error: 'Authentication failed' });
      }
      const passwordMatch = await bcrypt.compare(password, client.password);
      if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
      }
      const token = jwt.sign({ id: client._id }, 'your-secret-key', {
      expiresIn: '1h',
      });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
    };