import express from "express";
import {registerUser,loginUser,currentUser} from "../Controllers/userController.js";
import { validateToken } from "../Middlewares/validateToken.js";
// import loginUser from "../Controllers/userController.js";


const router = express.Router();

router.post("/register",registerUser)

router.post("/login",loginUser)


router.get("/currentusers", validateToken,currentUser)

export default router;
