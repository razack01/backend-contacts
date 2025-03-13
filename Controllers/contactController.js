import expressAsyncHandler from "express-async-handler"
import userRegisterconnection from "../config/userRegisterdb.js";


import constants from "../constants.js"
const getContacts = expressAsyncHandler(async (req, res) => {
  const userID = req.user.userID; // Extracted from JWT via authenticateUser middleware
  // console.log("userid",userID)
  
  try {
      const [rows] = await userRegisterconnection.promise().query(
          "SELECT * FROM ContactDetails WHERE userid = ?", 
          [userID]
      );
      res.status(200).json(rows);
  } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: 'Error fetching contacts', error });
  }
});



const getSingleContact = expressAsyncHandler(async (req, res) => {
  const contactID = parseInt(req.params.contactid, 10); // Ensure it's a number
  const userID = req.user.userID; // Extracted from JWT

  if (!contactID) {
      return res.status(400).json({ message: "Invalid contact ID" });
  }

  // Fetch contact only if it belongs to the logged-in user
  const sqlSingleGet = "SELECT * FROM ContactDetails WHERE id = ? AND userid = ?";
  
  userRegisterconnection.query(sqlSingleGet, [contactID, userID], (err, result) => {
    // console.log("results",result)
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
          return res.status(404).json({ message: "No contact found with this ID for the logged-in user" });
      }

      res.status(200).json(result[0]); // Return the single contact
  });
});




const createContact =expressAsyncHandler(async (req,res,next)=> {
    const { name, email, contact } = req.body;
    const userID = req.user.userID;

    if (!name || !email || !contact) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }

  const sqlCheck = "SELECT * FROM ContactDetails WHERE name = ?";
  // console.log("sqlcheck",sqlCheck)

  userRegisterconnection.query(sqlCheck, [name], (err, results) => {
    // console.log("results",results)
    if (err) {
      res.status(constants.SERVER_ERROR);
      return next(new Error("Database error: " + err.message));
    }

    if (results.length > 0) {
      res.status(constants.VALIDATION_ERROR);
      return next(new Error("Name already exists. Please choose a different name."));
    }
  
    const sqlInsertion = "INSERT INTO ContactDetails (name, email, contact,userID) VALUES (?, ?, ?,?)";
  
    userRegisterconnection.query(sqlInsertion, [name, email, contact,userID], (err, data) => {
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

const updateContact = expressAsyncHandler(async (req, res) => {
  const contactID = parseInt(req.params.contactid, 10); // Ensure it's a number
  // console.log(req.params)
  const { name, email, contact } = req.body;
  const userID = req.user.userID; // Extracted from JWT

  if (!name || !email || !contact) {
      res.status(400);
      throw new Error("All fields are mandatory");
  }

  // First, check if the contact exists and belongs to the logged-in user
  const sqlCheck = "SELECT * FROM ContactDetails WHERE id = ? AND userid = ?";
  userRegisterconnection.query(sqlCheck, [contactID, userID], (err, rows) => {
      if (err) {
          res.status(500).json({ message: "Database error", error: err });
          return;
      }

      if (rows.length === 0) {
          res.status(404).json({ message: "No contact found with this ID for the logged-in user" });
          return;
      }

      // Proceed with update if the contact belongs to the user
      const sqlUpdate = `
          UPDATE ContactDetails 
          SET name = ?, email = ?, contact = ? 
          WHERE id = ? AND userid = ?
      `;

      userRegisterconnection.query(sqlUpdate, [name, email, contact, contactID, userID], (updateErr, result) => {
          if (updateErr) {
              res.status(500).json({ message: "Database error", error: updateErr });
              return;
          }

          if (result.affectedRows > 0) {
              res.status(200).json({ message: "Contact updated successfully" });
          } else {
              res.status(400).json({ message: "Failed to update contact" });
          }
      });
  });
});

const deleteContact = expressAsyncHandler(async (req, res) => {
  const contactID = parseInt(req.params.contactid, 10);
  const userID = req.user.userID; // Extracted from JWT

  if (!contactID) {
      return res.status(400).json({ message: "Contact ID is required to delete contact" });
  }

  // First, check if the contact belongs to the logged-in user
  const sqlCheck = "SELECT * FROM ContactDetails WHERE id = ? AND userid = ?";
  userRegisterconnection.query(sqlCheck, [contactID, userID], (err, rows) => {
      if (err) {
          console.error("Error checking contact:", err);
          return res.status(500).json({ message: "Database error", error: err });
      }

      if (rows.length === 0) {
          return res.status(404).json({ message: "No contact found with this ID for the logged-in user" });
      }

      // If contact exists and belongs to the logged-in user, delete it
      const sqlDelete = "DELETE FROM ContactDetails WHERE id = ? AND userid = ?";
      userRegisterconnection.query(sqlDelete, [contactID, userID], (deleteErr, result) => {
          if (deleteErr) {
              console.error("Error deleting contact:", deleteErr);
              return res.status(500).json({ message: "Database error", error: deleteErr });
          }

          if (result.affectedRows > 0) {
              return res.status(200).json({ message: "Contact deleted successfully" });
          } else {
              return res.status(400).json({ message: "Failed to delete contact" });
          }
      });
  });
});


export default {getContacts,getSingleContact,createContact,updateContact,deleteContact}