"use strict";

var express = require("express");
var app = express();
require("dotenv").config();
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(express.static(__dirname + "/src"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile("/src/index.html");
});
//MongoDB
mongoose.connect(process.env.MONGO_URI);
var Schema = mongoose.Schema;
var userSchema = new Schema({
    user_name: { type: String, unique: true , required: true },
}, { timestamps: true });
var User = mongoose.model("User", userSchema);
var exerciseSchema = new Schema({
    user_id: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: String, default: new Date().toUTCString() }
});
var ExerciseTracker = mongoose.model("Exercise Tracker", exerciseSchema);
//NodeJS
app.post("/api/exercise/new-user", (req, res) => {
    User.findOne({ user_name: req.body.username }, (err, data) => {
        if(data == null) {
            var newUser = new User({
                user_name: req.body.username
            });
            newUser.save((err, data) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(data._id + " created!");
                    res.json({
                        "user_name": data.user_name,
                        "user_id": data._id 
                    });
                }
            });
        } else {
            res.json({
                "user_name": data.user_name,
                "user_id": data._id
            });
        }
    });
});
app.post("/api/exercise/add", (req, res) => {
    User.findOne({ _id: req.body.userId }, (err, data) => {
        if(data == null) {
            res.send(404);
        } else {
            var userDescription = new ExerciseTracker({
                user_id: req.body.userId,
                description: req.body.description,
                duration: req.body.duration,
                date: (req.body.date != "")? new Date(req.body.date).toUTCString(): new Date().toUTCString()
            });
            userDescription.save((err, result) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("User description created!");
                    res.json({
                        "user_name": data.user_name,
                        "description": result.description,
                        "duration": result.duration,
                        "date": result.date
                    });
                }
            });
        }
    });
});
app.get("/api/exercise/log", (req, res) => {
    var userId = req.query.userId;
    console.log(userId);
    var from = req.query.from;
    var to = req.query.to;
    var limit = parseInt(req.query.limit);
    var query = ExerciseTracker.find({ user_id: userId }).sort({ date: -1 }).limit(limit);
    query.exec((err, data) => {
        if(err) {
            console.log(err);
        }
        console.log(data);
        var result = data.filter((entry) => {
            if(from != undefined && to != undefined) {
                if (new Date(entry.date).getTime() >= new Date(from).getTime() && new Date(entry.date).getTime() <= new Date(to).getTime()) {
                    return entry;
                } 
            } else if (from != undefined) {
                if (new Date(entry.date).getTime() >= new Date(from).getTime()) {
                    return entry;
                }
            } else if (to != undefined) {
                if (new Date(entry.date).getTime() <= new Date(to).getTime()) {
                    return entry;
                }
            }
        });
        console.log(result);
        res.send(result);
    });
});

var listener = app.listen(process.env.PORT, () => {
    console.log("Application is listening on port " + listener.address().port)
});
