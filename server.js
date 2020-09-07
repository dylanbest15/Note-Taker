// Requirements
var express = require("express");
var path = require("path");
var fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// ROUTES

// api get request
app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw err;
        res.json(JSON.parse(data));
    })
})

// api post request
app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    newNote.id = uuidv4();
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw err;
        var notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
            if (err) throw err;
            res.status(200).end();
        })
    })
})

// api delete request
app.delete("/api/notes/:id", function (req, res) {
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw err;
        const newArray = JSON.parse(data).filter(note => note.id != req.params.id)
        fs.writeFile("./db/db.json", JSON.stringify(newArray), function (err) {
            if (err) throw err;
            res.status(200).end();
        })
    })
})


// html routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});