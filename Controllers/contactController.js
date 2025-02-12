import expressAsyncHandler from "express-async-handler"
import con from "../config/dbConnection.js";
import constants from "../constants.js"
const getContacts =expressAsyncHandler (async (req,res)=> {
    const [rows] = await con.promise().query("SELECT * FROM ContactDetails");
    console.log("Contacts:", rows);
    res.status(200).json(rows);
    // res.status(200).json({"message":"Get All contacts"})
})



const getSingleContact = expressAsyncHandler(async (req, res) => {
    const contactid = req.params.contactid; // Ensure it's a number
    console.log("contactid", contactid)
  
    if (!contactid) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }
  
    const sqlSingleGet = "SELECT * FROM ContactDetails WHERE Contactid = ?";
    
    con.query(sqlSingleGet, [contactid], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No contact found with this ID" });
      }
  
      res.status(200).json(result);
    });
  });



const createContact =expressAsyncHandler(async (req,res,next)=> {
    const { name, email, contact } = req.body;

    if (!name || !email || !contact) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }

  const sqlCheck = "SELECT * FROM ContactDetails WHERE name = ?";
  console.log("sqlcheck",sqlCheck)

  con.query(sqlCheck, [name], (err, results) => {
    console.log("results",results)
    if (err) {
      res.status(constants.SERVER_ERROR);
      return next(new Error("Database error: " + err.message));
    }

    if (results.length > 0) {
      res.status(constants.VALIDATION_ERROR);
      return next(new Error("Name already exists. Please choose a different name."));
    }
  
    const sqlInsertion = "INSERT INTO ContactDetails (name, email, contact) VALUES (?, ?, ?)";
  
    con.query(sqlInsertion, [name, email, contact], (err, data) => {
      if (err) {
        res.status(500).json({ message: "Database error", error: err });
        return;
      }
  
      if (data.affectedRows > 0) {
        // const id = data.insertId;
        // const token = jwt.sign({ id }, "jwtsecretKey", { expiresIn: "365d" });
        res.status(201).json({ data, message: "New contact created" });
      }
    });
  })
   
})

const updateContact = expressAsyncHandler (async(req,res)=> {
    // res.status(200).json({"message":`Update contact for ${req.params.contactid}`})
    const Contactid = parseInt(req.params.contactid, 10); // Ensure it's a number
  const { name, email, contact } = req.body;

  if (!name || !email || !contact) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  // First, check if the contact exists
  const sqlCheck = "SELECT * FROM ContactDetails WHERE Contactid = ?";
  con.query(sqlCheck, [Contactid], (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Database error", error: err });
      return;
    }

    if (rows.length === 0) {
      res.status(404).json({ message: "No contact found with this ID" });
      return;
    }

    // Proceed with update if the contact exists
    const sqlUpdate = "UPDATE ContactDetails SET name = ?, email = ?, contact = ? WHERE Contactid = ?";
    con.query(sqlUpdate, [name, email, contact, Contactid], (updateErr, result) => {
      if (updateErr) {
        res.status(500).json({ message: "Database error", error: updateErr });
        return;
      }

      res.status(200).json({ message: "Contact updated successfully", data: result });
    });
  });
})

const deleteContact = expressAsyncHandler(async (req, res) => {
    const contactid  = req.params.contactid;
    console.log(contactid)
  
    if (!contactid) {
      return res.status(400).json({ message: "ID is required to delete contact" });
    }
  
    const sqlDelete = "DELETE FROM ContactDetails WHERE contactid = ?";
    
    con.query(sqlDelete, [contactid], (err, result) => {
      if (err) {
        console.error("Error deleting contact:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No contact found with this ID" });
      }
  
      res.status(200).json({ message: "Contact deleted successfully", data: result });
    });
  });


export default {getContacts,getSingleContact,createContact,updateContact,deleteContact}