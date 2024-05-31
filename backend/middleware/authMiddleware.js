
const jwt = require('jsonwebtoken');

const Worker = require("../models/worker.js");
const Client = require("../models/client.js");


async function verifyClientToken(req, res, next) {
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
async function verifyAdminToken(req, res, next) {
    try {
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ error: 'Access denied' });
        const decoded = jwt.verify(token, "secret");
        req.email = decoded.email;
        const worker = await Worker.findOne({ email:decoded.email });
        if (!worker || worker.type != "admin"){
            return res.status(401).json({ error: 'worker does not exist or does not have permission' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message, "hello": "world" });
    }
 };
 async function verifyDoctorToken(req, res, next) {
    try {
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ error: 'Access denied' });
        const decoded = jwt.verify(token, "secret");
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
    try {
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ error: 'Access denied' });
        const decoded = jwt.verify(token, "secret");
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


 async function verifyDcotorOrClientisToken(req, res, next) {
    try {
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ error: 'Access denied' });
        const decoded = jwt.verify(token, "secret");
        req.email = decoded.email;
        const worker = await Worker.findOne({ email:decoded.email });
        const client = await Client.findOne({ email:decoded.email });
        if (worker && worker.type == "doctor"){
            next();
        }
        if (client){
            next();
        }
        return res.status(401).json({ error: 'worker or client does not exist or does not have permission' });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
 };
module.exports.verify_admin_token = verifyAdminToken;
module.exports.verify_client_token = verifyClientToken;
module.exports.verify_doctor_token = verifyDoctorToken;
module.exports.verify_receptionist_token = verifyReceptionisToken;
module.exports.verify_doctor_or_client_token = verifyDcotorOrClientisToken;