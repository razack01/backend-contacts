// const express = require('express')
import express from "express";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js"

// const dotenv = require('dotenv').config();
import dotenv from "dotenv";
import errorHandler from "./Middlewares/errorhandler.js";
import userRegisterconnection from './config/userRegisterdb.js'
dotenv.config();

const app =express()

const port =process.env.PORT|| 4001;



app.use(express.json())
app.use("/api/contacts", contactRoutes)
app.use("/api/users", userRoutes)

app.use(errorHandler)

userRegisterconnection.connect((err)=>{
    if (err){
        throw err
    }
    console.log("users Db connected")

})

app.listen(port,() => {
    console.log(`Server running on port ${port}`)
})