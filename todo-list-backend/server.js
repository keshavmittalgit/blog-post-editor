const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite Database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed BOOLEAN)");
});

// Routes
app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.post('/tasks', (req, res) => {
  const { text, completed } = req.body;
  db.run("INSERT INTO tasks (text, completed) VALUES (?, ?)", [text, completed], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  db.run("UPDATE tasks SET text = ?, completed = ? WHERE id = ?", [text, completed, id], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(204).send();
    }
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(204).send();
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
