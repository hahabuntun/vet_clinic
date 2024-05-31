
const jwt = require('jsonwebtoken');

const Worker = require("../models/worker.js");
const Client = require("../models/client.js");


module.exports.verify_client_token = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ error: 'Access denied' });
        const decoded = jwt.verify(token, "secret");
        req.email = decoded.email;
        const client = await Client.findOne({ email:decoded.email });
        if (!client){
            return res.status(401).json({ error: 'client does not exist or does not have permission' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
 };
 module.exports.verify_admin_token = async (req, res, next) => {
    try {
        console.log("here");
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ error: 'Access denied' });
        const decoded = jwt.verify(token, "secret");
        req.email = decoded.email;
        const worker = await Worker.findOne({ email:decoded.email });
        if (!worker || worker.type != "admin"){
            return res.status(401).json({ error: 'admin does not exist or does not have permission' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message, "hello": "world" });
    }
 };
 module.exports.verify_doctor_token = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ error: 'Access denied' });
        const decoded = jwt.verify(token, "secret");
        req.email = decoded.email;
        const worker = await Worker.findOne({ email:decoded.email });
        if (!worker || worker.type != "doctor"){
            return res.status(401).json({ error: 'doctor does not exist or does not have permission' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message });
    }
 };
 module.exports.verify_receptionist_token = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ error: 'Access denied' });
        console.log(token);
        const decoded = jwt.verify(token, "secret");
        req.email = decoded.email;
        const worker = await Worker.findOne({ email:decoded.email });
        console.log(decoded.email);
        if (!worker || worker.type != "receptionist"){
            return res.status(401).json({ error: 'receptionist does not exist or does not have permission' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
 };