const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("daily-report-db")

	let start_date = new Date(req.query.start)
	let end_date = new Date(req.query.end)

    db_connect
        .collection("_weightlift-session")
        // get between dates
        .find({
            date: {
                $gt: start_date,
                $lt : end_date
            }
        })
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);

            if (result.length > 0) {
                console.log(`Start: ${start_date}\nEnd:${end_date}\nData:${result}`);

            }
        });

	
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

recordRoutes.route("/record/getbydate/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { date: {$eq : req.params.date} };
    db_connect.collection("records").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// Get single record by id
recordRoutes.route("/today/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
        date: req.body.date,
        day: req.body.day,
        status: req.body.status,
    };
    db_connect.collection("records").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
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
        .collection("records")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});

// This section will help you delete a record
recordRoutes.route("/deleteall").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = {};
    db_connect.collection("records").deleteMany(myquery, function (err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " document deleted");
        response.json(obj);
    });

	console.log('deleted');
});

module.exports = recordRoutes;
