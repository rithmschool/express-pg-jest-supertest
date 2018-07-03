const express = require("express");
const app = express();
const db = require("./db");
const students = ["Elie", "Matt", "Joel", "Michael"];
const bodyParser = require("body-parser");
const studentRoutes = require("./routes/students");

app.use(bodyParser.json());
app.use("/students", studentRoutes);

app.get("/", (req, res) => {
  return res.json(students);
});

module.exports = app;
