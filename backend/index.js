const mongoose = require("mongoose");
const express = require("express");


var app = express();


const login_routes = require("./routes/login");
const admin_routes = require("./routes/admin");

app.use(express.json())

app.use('/', login_routes);
app.use('/', admin_routes);


mongoose.connect("mongodb://root:root@127.0.0.1:27017/").then(()=>{
    console.log("Connected to database");
    app.listen(3000, ()=>{
        console.log("Server is running on port 3000")
    });
})
.catch(()=>{
    console.log("connection failed")
})