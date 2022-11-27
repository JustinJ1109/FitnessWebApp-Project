
const express = require("express");

// liftRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /lift_library.
const liftRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

liftRoutes.route("/lift_library/add").post(function (req, response) {
    let db_connect = dbo.getDb();

    if (req.body.name !== '') {
        db_connect.collection("_lift_library").updateOne(
            {name:req.body.name}, 
            { $setOnInsert: {
                type: req.body.tags,
            } }, {upsert:true}, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
    }
    else {
        console.log("receieved empty string, not adding")
        response.status(400).json(req.body)
    }



    
})

liftRoutes.route("/lift_library").get(function (req, res) {
    let db_connect = dbo.getDb("daily-report-db")

    db_connect
        .collection("_lift_library")
        .find({})
        .sort({name : 1})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });

    console.log("fetching all lifts");
})

liftRoutes.route("/lift_library/:id").get(function (req, res) {
    console.log("Retrieving record by id");
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("_lift_library").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
})



liftRoutes.route("/lift_library/update/:id").post(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: req.body.name,
            tags: req.body.tags,
        },
    };
    db_connect
        .collection("_lift_library")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
})

liftRoutes.route("/lift_library/:id").delete(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("_lift_library").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
})

module.exports = liftRoutes;
