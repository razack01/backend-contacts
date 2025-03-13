// const express = require('express')
import express from "express";
// import  getContacts  from "../Controllers/contactController.js";
const router = express.Router()

import contactController from "../Controllers/contactController.js";
import { validateToken } from "../Middlewares/validateToken.js";

const { getContacts, getSingleContact,createContact,updateContact,deleteContact} = contactController;

router.use(validateToken)
router.route("/").get(getContacts).post(createContact)

router.route("/:contactid").get(getSingleContact).put(updateContact).delete(deleteContact)




export default router;