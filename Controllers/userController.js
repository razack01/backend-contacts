import expressAsyncHandler from "express-async-handler"
import userRegisterconnection from "../config/userRegisterdb.js";
import constants from "../constants.js"
import jwt from "jsonwebtoken"

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
    // console.log("sqlCheck:", sqlCheck);

    // Check if the email exists in the database
    const [results] = await userRegisterconnection.promise().query(sqlCheck, [email]);
    // console.log("results",results)

    // If email already exists, return an error
    if (results.length > 0) {
        res.status(constants.VALIDATION_ERROR);
        return next(new Error("Email already exists. Please choose a different email."));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashedPassword:", hashedPassword);

    // SQL query to insert the new user into the database
    const registerQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    await userRegisterconnection.promise().query(registerQuery, [name, email, hashedPassword]);

    // Send response after successful registration
    res.status(201).send("User registered successfully");
});




const loginUser =expressAsyncHandler (async(req,res)=>{
    const { email, password } = req.body;

    if(!email || !password){
        res.status(400)
        throw new Error ("All fields are mandatory")
    }

    // Find the user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    userRegisterconnection.query(query, [email], async (err, results) => {
        // console.log("users results" , results)
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];
            // console.log(user)

            // Compare the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
             
            const userdetails = {username:user.name,
                userID: user.userid,
                email:user.email}
            // console.log("useremail =", useremail)
          console.log(" userdetails", userdetails)
            
            const accessToken= jwt.sign(userdetails,"abdulsecretkey",{expiresIn:'1h'})

            if (isMatch) {
                res.status(200).json({token:accessToken});
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(404).send('User not found');
        }
    });
})

const currentUser =(req,res)=>{

    console.log("req.yser",req.user)
    // const [rows] = await userRegisterconnection.promise().query("SELECT * FROM users");
    // console.log("users:", rows);
    res.json(req.user);
}

export  {registerUser,loginUser,currentUser}