const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "school",
  });
  
  con.connect((err) => {
    if (err) {
      console.log("connection error : " + err.stack);
      return;
    }
    console.log("Connection Success");
  });

module.exports = router;