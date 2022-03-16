const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const router = require('./router/routes');
const users = require('./router/users');
const courses = require('./router/courses')
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

(async function (){
    mongoose.connect(process.env.DB_URI,()=>{
    console.log("connected to the database");
})}())


app.listen(PORT,()=>{
    console.log("the Server is Running on: " + PORT);
})

app.use("/",router);
app.use("/users",users);
app.use("/coureses",courses);


