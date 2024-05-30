const mongoose = require("mongoose");
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();


var app = express();

const login_routes = require("./routes/login");
const admin_routes = require("./routes/admin");
const receptionis_routes = require("./routes/receptionist");
const doctor_routes = require("./routes/doctor");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.static('static', { 
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'text/javascript');
        }
    }
}));

app.use(express.json())
app.use(upload.none());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', login_routes);
app.use('/', admin_routes);
app.use('/', receptionis_routes);
app.use('/', doctor_routes);


mongoose.connect("mongodb://127.0.0.1:27017/test").then(()=>{
    console.log("Connected to database");
    app.listen(3000, ()=>{
        console.log("Server is running on port 3000")
    });
})
.catch(()=>{
    console.log("connection failed")
})