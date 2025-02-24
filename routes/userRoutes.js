import express from "express";
import {registerUser,loginUser,currentUser} from "../Controllers/userController.js";
// import loginUser from "../Controllers/userController.js";


const router = express.Router();

router.post("/register",registerUser)

router.post("/login",loginUser)


router.get("/current",currentUser)

export default router;
