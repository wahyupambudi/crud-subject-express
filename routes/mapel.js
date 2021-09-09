const express = require("express");
const router = express.Router();
const konek = require("./connect");

console.log("asd " + konek);


router.get("/", (req, res) => {
    konek.query("SELECT * FROM mapel", (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
      }
      res.render("./mapel.ejs", { schools: results });
    });
  });



module.exports = router;