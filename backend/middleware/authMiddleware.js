
const jwt = require('jsonwebtoken');

const Worker = require("../models/worker.js");
const Client = require("../models/client.js");



async function verifyClientToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        req.id = decoded.id;
        const client = await Client.findOne({ _id:id });
        if (!client){
            throw new Error('client does not exist');
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
 };


 async function verifyAdminToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        req.id = decoded.id;
        const worker = await Worker.findOne({ _id:id });
        if (!worker || worker.type != "admin"){
            throw new Error('worker does not exist or does not have permission');
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
 };


 async function verifyDoctorToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        req.id = decoded.id;
        const worker = await Worker.findOne({ _id:id });
        if (!worker || worker.type != "doctor"){
            throw new Error('worker does not exist or does not have permission');
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
 };


 async function verifyReceptionisToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        req.id = decoded.id;
        const worker = await Worker.findOne({ _id:id });
        if (!worker || worker.type != "receptionist"){
            throw new Error('worker does not exist or does not have permission');
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
 };

module.exports.verify_admin_token = verifyAdminToken;
module.exports.verify_client_token = verifyClientToken;
module.exports.verify_doctor_token = verifyDoctorToken;
module.exports.verify_receptionist_token = verifyReceptionisToken;