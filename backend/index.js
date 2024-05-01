const mongoose = require("mongoose");
const express = require("express");
const path = require('path');


var app = express();

const login_routes = require("./routes/login");
const admin_routes = require("./routes/admin");
const receptionis_routes = require("./routes/receptionist");

app.use(express.json())

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.static('static'));

app.use('/', login_routes);
app.use('/', admin_routes);
app.use('/', receptionis_routes);


mongoose.connect("mongodb://127.0.0.1:27017/").then(()=>{
    console.log("Connected to database");
    app.listen(3000, ()=>{
        console.log("Server is running on port 3000")
    });
})
.catch(()=>{
    console.log("connection failed")
})