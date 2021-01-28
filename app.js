// app.js
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.status(200).json({ "message": "Hello World!" });
});



app.post("/bookmarks", (req, res) => {
    if (req.body.url === undefined || req.body.title === undefined) {
        res.status(422).json({ "error": "required field(s) missing" });
    }
    else {

        connection.query(
            "INSERT INTO bookmark (url,title) VALUES(?, ?)",
            [req.body.url, req.body.title],
            (err, insertedBookmark) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error adding a bookmark");
                } else {

                    connection.query("SELECT * FROM bookmark WHERE id = ?  ", [insertedBookmark.insertId],
                        (err, bookmarksReturned) => {
                            if (err) {
                                res.status(500).send("Error retrieving data");
                            } else {
                                res.status(201).json(bookmarksReturned[0]);
                            }
                        });
                }
            }
        );
    }
});


app.get("/bookmarks/:id", (req, res) => {

    connection.query("SELECT * FROM bookmark WHERE id = ? ", [req.params.id],
        (err, bookmarksReturned) => {
            if (err) {
                res.status(500).send("Error retrieving data");
            } else {
                if (bookmarksReturned.length <= 0) {
                    res.status(404).json({ "error": "Bookmark not found" });
                } else {
                    res.status(200).json(bookmarksReturned[0]);
                }
            }
        });

});


module.exports = app;
