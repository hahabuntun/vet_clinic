const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Worker = require("../models/worker.js");
const Client = require("../models/client.js");








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
    const token = jwt.sign({ email: email }, "secret", {
    expiresIn: '1h',
    });
    console.log(token.length);
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
      const token = jwt.sign({ email: client.email }, "secret", {
      expiresIn: '1h',
      });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
    };