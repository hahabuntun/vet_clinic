const mongoose = require("mongoose");
const express = require("express");

const Client = require("./models/client.js");

Client.create();

var app = express();

app.use(express.json())


app.get('/',(req,res,next)=>{
    //Создадим новый handler который сидить по пути `/`
    res.send('Hello, World!');
    // Отправим привет миру!
});





app.get("/", (req, res) =>{
    res.send("Hello from node api")
});


app.post("/api/clients", (req, res)=>{

});


mongoose.connect("mongodb://root:root@127.0.0.1:27017/").then(()=>{
    console.log("Connected to database");
    app.listen(3000, ()=>{
        console.log("Server is running on port 3000")
    });
})
.catch(()=>{
    console.log("connection failed")
})