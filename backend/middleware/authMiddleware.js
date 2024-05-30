
const jwt = require('jsonwebtoken');

const Worker = require("../models/worker.js");
const Client = require("../models/client.js");


async function verifyClientToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token.substring(7), "secret");
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
async function verifyAdminToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token.substring(7), "secret");
        req.email = decoded.email;
        const worker = await Worker.findOne({ email:decoded.email });
        if (!worker || worker.type != "admin"){
            return res.status(401).json({ error: 'worker does not exist or does not have permission' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: error.message, "hello": "world" });
    }
 };
 async function verifyDoctorToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token.substring(7), "secret");
        req.email = decoded.email;
        const worker = await Worker.findOne({ email:decoded.email });
        if (!worker || worker.type != "doctor"){
            return res.status(401).json({ error: 'worker does not exist or does not have permission' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
 };
 async function verifyReceptionisToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token.substring(7), "secret");
        req.email = decoded.email;
        const worker = await Worker.findOne({ email:decoded.email });
        if (!worker || worker.type != "receptionist"){
            return res.status(401).json({ error: 'worker does not exist or does not have permission' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
 };
module.exports.verify_admin_token = verifyAdminToken;
module.exports.verify_client_token = verifyClientToken;
module.exports.verify_doctor_token = verifyDoctorToken;
module.exports.verify_receptionist_token = verifyReceptionisToken;