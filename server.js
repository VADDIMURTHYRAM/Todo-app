const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = "data.json";

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all notes
app.get("/notes", (req, res) => {
  const data = readData();
  res.json(data);
});

// POST new note
app.post("/notes", (req, res) => {
  const data = readData();
  const newNote = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  data.push(newNote);
  writeData(data);
  res.json(newNote);
});

// DELETE note
app.delete("/notes/:id", (req, res) => {
  let data = readData();
  data = data.filter(note => note.id != req.params.id);
  writeData(data);
  res.json({ message: "Deleted" });
});

// TOGGLE complete
app.put("/notes/:id", (req, res) => {
  let data = readData();
  data = data.map(note =>
    note.id == req.params.id
      ? { ...note, completed: !note.completed }
      : note
  );
  writeData(data);
  res.json({ message: "Updated" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});