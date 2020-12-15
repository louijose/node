"use strict";

var express = require("express");
var app = express();
require("dotenv").config();

app.use(express.static("src"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
});

app.get("/api/timestamp/:date_string?", (req, res) => {
    var date_string = req.params.date_string != undefined ? req.params.date_string : new Date();
    if (!/-/.test(date_string)) {
        date_string = parseInt(date_string);
    }
    var utc = new Date(date_string).toUTCString();
    var unix = new Date(date_string).getTime();
    res.json({
        "unix": unix,
        "utc": utc
    });
});

var listener = app.listen(process.env.PORT, () => {
    console.log("Application is listening on port " + listener.address().port);
});