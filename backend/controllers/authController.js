const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Worker = require("../models/worker.js");
const Client = require("../models/client.js");


module.exports.get_login_page = async (req, res) =>{
  try{
    res.render("login.ejs");
  }catch(error)
  {
    res.status(500).json({ error: error });
  }
}
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
      console.log(token);
      res.cookie('authToken', token, { maxAge: 3600000, httpOnly: true });
      var redirect_url = "";
      if (worker.type == "doctor"){
        redirect_url = `/doctors/${worker._id}/schedule`;
      }else if(worker.type == "receptionist"){
        redirect_url = `/clients`;
      }
      else if (worker.type == "admin"){
        redirect_url = `/workers`
      }
      res.status(200).json({ redirect_url });
  } catch (error) {
    console.log(error);
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
      res.cookie('authToken', token, { maxAge: 3600000, httpOnly: true });
      var redirect_url = `/clients/${client._id}/main`
      res.status(200).json({ redirect_url });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Login failed' });
    }
  };

  module.exports.logout = async (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login'); // Перенаправляем на страницу входа
}