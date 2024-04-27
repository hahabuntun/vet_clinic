const mongoose = require("mongoose");
const express = require("express");

var app = express();


app.get('/',(req,res,next)=>{
    //Создадим новый handler который сидить по пути `/`
    res.send('Hello, World!');
    // Отправим привет миру!
});


app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
});


app.get("/", (req, res) =>{
    res.send("Hello from node api")
});