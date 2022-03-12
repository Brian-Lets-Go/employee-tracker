const inquirer = require("inquirer");
const mysql = require("mysql2");
const console = require("console.table");

// const PORT = 3001;

// const db = mysql.createConnection({
//     host: 'localhost',
//     port: 3006,
//     // Your MySQL username,
//     user: 'root',
//     // Your MySQL password
//     password: 'newPassword',
//     database: 'tracker'
//   });

// // Start server after DB connection
// db.connect(err => {
//     if (err) throw err;
//     start();
// });

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "newPassword"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

// function start() {
//     console.log("STARTED!");
// }
