import express from "express"
import expressAsyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"


const validateToken = async (req, res, next) => {
    // console.log("rquest",req)
    console.log("Token function called");

    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]; // Extract token

        try {
            const decoded = jwt.verify(token, "abdulsecretkey");
            req.user = decoded.user; // Attach user to request object
            console.log("Decoded Token:", decoded);
            
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err.message);
            res.status(401);
            throw new Error("User is not authorized - Invalid Token");
        }
    } else {
        res.status(401);
        throw new Error("User is not authorized - No Token");
    }
};
export {validateToken}