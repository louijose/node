"use strict";

var express = require("express");
var app = express();
require("dotenv").config();
var cors = require("cors");
var bodyParser = require("body-parser");
//multer to handle multipart/form-data
var multer = require("multer");//Add 'enctype="multipart/form-data"' to the form attributes
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "/uploads");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname + "-" + Date.now());
    }
});
var upload = multer({ storage: storage });
// var upload = multer({ dest: __dirname + "/uploads" });

app.use(express.static(__dirname + "/src"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.sendFile("/src/index.html");
});
app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
    res.json({
        "name": req.file.originalname,
        "type": req.file.mimetype,
        "size": req.file.size
    });
});

var listener = app.listen(process.env.PORT, () => {
    console.log("Application is listening on port " + listener.address().port)
});
