// const express = require('express')
import express from "express";
// import  getContacts  from "../Controllers/contactController.js";
const router = express.Router()

import contactController from "../Controllers/contactController.js";

const { getContacts, getSingleContact,createContact,updateContact,deleteContact} = contactController;


router.route("/").get(getContacts).post(createContact)

router.route("/:contactid").get(getSingleContact).put(updateContact).delete(deleteContact)




export default router;