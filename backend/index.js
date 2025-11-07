const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Create database
const db = new sqlite3.Database("./favorites.db");

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  type TEXT
)`);

// GET all favorites
app.get("/favorites", (req, res) => {
  db.all("SELECT * FROM favorites", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a favorite
app.post("/favorites", (req, res) => {
  const { title, type } = req.body;
  db.run("INSERT INTO favorites (title, type) VALUES (?, ?)", [title, type], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, title, type });
  });
});

// DELETE a favorite
app.delete("/favorites/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM favorites WHERE id = ?", id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Favorite deleted" });
  });
});

// Start server
app.listen(5000, () => console.log("Backend running on port 5000"));

