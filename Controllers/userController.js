import expressAsyncHandler from "express-async-handler"
import userRegisterconnection from "../config/userRegisterdb.js";
import constants from "../constants.js"

// const bcrypt = require('bcryptjs')
import bcrypt from 'bcryptjs';


// register a User
const registerUser = expressAsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        res.status(400);
        return next(new Error("All fields are mandatory"));
    }

    // SQL query to check if the email already exists
    const sqlCheck = "SELECT * FROM users WHERE email = ?";
    console.log("sqlCheck:", sqlCheck);

    // Check if the email exists in the database
    const [results] = await userRegisterconnection.promise().query(sqlCheck, [email]);
    console.log("results",results)

    // If email already exists, return an error
    if (results.length > 0) {
        res.status(constants.VALIDATION_ERROR);
        return next(new Error("Email already exists. Please choose a different email."));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword:", hashedPassword);

    // SQL query to insert the new user into the database
    const registerQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    await userRegisterconnection.promise().query(registerQuery, [name, email, hashedPassword]);

    // Send response after successful registration
    res.status(201).send("User registered successfully");
});




const loginUser =expressAsyncHandler (async(req,res)=>{
    res.json({message: "Login the User"})
})

const currentUser =expressAsyncHandler (async(req,res)=>{
    console.log("triggered")
    res.json({message: "Current user Information"})
})

export  {registerUser,loginUser,currentUser}