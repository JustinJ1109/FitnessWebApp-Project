const express = require("express");

// colorRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const colorRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you create a new record.
colorRoutes.route("/color/add").post(function (req, response) {
    let db_connect = dbo.getDb();
    let inc_color = req.body

    db_connect
    .collection("_color_themes")
    .updateOne(
        {name: {$eq : inc_color.name}}, 
        { 
        $setOnInsert: {
            background: inc_color.background,
            main : inc_color.main,
            highlight1: inc_color.highlight1,
            highlight2: inc_color.highlight2
        } 
        }, 
        {upsert:true}, 
        function (err, res) {
    if (err) throw err;
    response.json(res);
    });
    
});


// This section will help you get a list of all the colors.
colorRoutes.route("/color").get(function (req, res) {
    let db_connect = dbo.getDb("daily-report-db")
    console.log(`Finding all colors`)
    db_connect
        .collection("_color_themes")
        // get between dates
        .find({
            name : {$eq: name}
        })
        .sort({date : 1})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you update a color by id.
// FIXME: maybe not needed
colorRoutes.route("/color/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        },
    };
    db_connect
        .collection("_color_themes")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

// This section will help you delete a color
// FIXME: maybe not needed
colorRoutes.route("/color/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("_color_themes").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});





module.exports = colorRoutes;

