import mysql from "mysql2";

const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Password@2022",
    database:"contacts"
  })

//   con.connect (err) =>{

//   }    if (err) throw err;
//     console.log("Connected!");
//   });



  export default con