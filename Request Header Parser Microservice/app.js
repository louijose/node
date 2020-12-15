"use strict";

var express = require("express");
var app = express();
require("dotenv").config();

app.use(express.static(__dirname + "/src"));

app.get("/", (req, res) => {
    res.sendFile("/src/index.html");
});

app.get("/api/whoami", (req, res) => {
    var address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || null;
    if(address && address.indexOf(",") > -1) {
        address = address.slice(0, address.indexOf(",") - 1);
    }
    var language = req.headers['accept-language'] || null;
    var software = req.headers['user-agent'] || null;
    res.json({ 
        "ipaddress": address,
        "language": language,
        "software": software
    })
});

var listener = app.listen(process.env.PORT, () => {
    console.log("Application is listening on port " + listener.address().port)
});
