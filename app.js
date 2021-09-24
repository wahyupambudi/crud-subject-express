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
  res.render("guru/new.ejs", { errors: [] });
});

// proses add to database
app.post(
  "/createg",
  (req, res, next) => {
    console.log("Pemeriksaan input kosong");
    const idguru = req.body.idGuru;
    const namaguru = req.body.namaGuru;
    const errors = [];

    if (idguru === "") {
      errors.push("Id Guru Kosong");
    }
    if (namaguru === "") {
      errors.push("Nama Guru Kosong");
    }
    if (errors.length > 0) {
      res.render("guru/new.ejs", { errors: errors });
    } else {
      next();
    }
  },
  (req, res, next) => {
    console.log("Pemeriksaan ID Guru");
    const idguru = req.body.idGuru;
    const errors = [];
    con.query(
      "SELECT * FROM guru WHERE id_guru = ?",
      [idguru],
      (error, results) => {
        if (results.length > 0) {
          errors.push("ID Guru tidak boleh sama.");
          res.render("guru/new.ejs", { errors: errors });
        } else {
          next();
        }
      }
    );
  },
  (req, res) => {
    con.query(
      "INSERT INTO guru (id_guru, nama_guru) VALUES (?, ?)",
      [req.body.idGuru, req.body.namaGuru],
      (error, results) => {
        console.log(error);
        console.log(results);
        res.redirect("/guru");
      }
    );
  }
);

app.get("/editg/:id", (req, res) => {
  con.query(
    "SELECT * FROM guru WHERE id_guru = ?",
    [req.params.id],
    (error, results) => {
      console.log(error);
      console.log(results);
      res.render("guru/edit.ejs", { gurus: results[0], errors: [] });
    }
  );
});

app.post(
  "/updateg/:id",
  (req, res, next) => {
    const idguru = req.body.idGuru;
    const namaguru = req.body.namaGuru;
    const errors = [];

    if (idguru === "") {
      errors.push("Id Guru Tidak Boleh Kosong!");
    }
    if (namaguru === "") {
      errors.push("Nama Guru Tidak Boleh Kosong!");
    }
    if (errors.length > 0) {
      res.render("guru/edit.ejs", { errors: errors });
    } else {
      next();
    }
  },
  (req, res) => {
    con.query(
      "UPDATE guru SET nama_guru = ? WHERE id_guru = ?",
      [req.body.namaGuru, req.params.id],
      (error, results) => {
        console.log(error);
        console.log(results);
        res.redirect("/guru");
      }
    );
  }
);

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

app.get("/mapelbaru", (req, res) => {
  res.render("mapel/new.ejs", { errors: [] });
});

app.post(
  "/createmapel",
  (req, res, next) => {
    console.log("Pemeriksaan Input Kosong");
    const idmapel = req.body.idMapel;
    const namamapel = req.body.namaMapel;
    const errors = [];

    if (idmapel === "") {
      errors.push("Id Mapel Tidak Boleh Kosong");
    }
    if (namamapel === "") {
      errors.push("Nama Mata Pelajaran Tidak Boleh Kosong");
    }
    if (errors.length > 0) {
      res.render("mapel/new.ejs", { errors: errors });
    } else {
      next();
    }
  },
  (req, res) => {
    console.log("Lanjut");
    const idmapel = req.body.idMapel;
    const namamapel = req.body.namaMapel;
    con.query(
      "INSERT into mapel (id_mapel, nama_mapel) VALUES (?, ?)",
      [idmapel, namamapel],
      (error, results) => {
        res.redirect("/mapel");
      }
    );
  }
);

app.get("/editmapel/:id", (req, res) => {
  const idmapel = req.params.id;
  con.query(
    "SELECT * FROM mapel WHERE id_mapel = ?",
    [idmapel],
    (error, results) => {
      res.render("mapel/edit.ejs", {mapels: results[0], errors: []});
    }
  );
});

app.post("/updatemapel/:id", (req, res, next) => {
  console.log("asdasda");
});

app.post("/deletemapel/:id", (req, res) => {
  const idmapel = req.params.id;
  con.query(
    "DELETE FROM mapel WHERE id_mapel = ?",
    [idmapel],
    (error, results) => {
      console.log(error);
      console.log(results);
      res.redirect("/mapel");
    }
  );
});

//============================================================================= kelas
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
