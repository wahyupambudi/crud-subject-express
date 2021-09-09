const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

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

//============================================================================= home
app.get("/", (req, res) => {
  res.render("index.ejs");
});

//============================================================================= data guru
app.get("/guru", (req, res) => {
  con.query("SELECT * FROM guru", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
    }
    res.render("guru/guru.ejs", { teachers: results });
  });
});

// add guru
app.get("/newg", (req, res) => {
  res.render("guru/new.ejs");
});

app.post("/createg", (req, res) => {
  con.query(
    "INSERT INTO guru (id_guru, nama_guru) VALUES (?, ?)",
    [req.body.idGuru, req.body.namaGuru],
    (error, results) => {
      console.log(error);
      console.log(results);
      res.redirect("/guru");
    }
  );
});

app.get("/editg/:id", (req, res) => {
  con.query(
    "SELECT * FROM guru WHERE id_guru = ?",
    [req.params.id],
    (error, results) => {
      console.log(error);
      console.log(results);
      res.render("guru/edit.ejs", { gurus: results[0] });
    }
  );
});

// delete guru
app.post("/deleteg/:id", (req, res) => {
  con.query(
    "DELETE FROM guru WHERE id_guru = ?",
    [req.params.id],
    (error, results) => {
      console.log(error);
      console.log(results);
      res.redirect("/guru");
    }
  );
});

//============================================================================= mapel
app.get("/mapel", (req, res) => {
  con.query("SELECT * FROM mapel", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
    }
    res.render("mapel/mapel.ejs", { mapels: results });
  });
});

//============================================================================= data guru
app.get("/kelas", (req, res) => {
  con.query("SELECT * FROM kelas", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
    }
    res.render("kelas/kelas.ejs", { kelass: results });
  });
});

//============================================================================= data all mapel
app.get("/allmapel", (req, res) => {
  con.query("SELECT * FROM matapelajaran", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
    }
    res.render("allmapel/allmapel.ejs", { allmapels: results });
  });
});

app.listen(port, () => {
  console.log(`Run on http://localhost:${port}`);
});
