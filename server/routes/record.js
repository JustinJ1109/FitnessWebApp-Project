const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
    let db_connect = dbo.getDb();

    console.log(req.body)
    let dates = req.body

    dates.map((d) => {
        db_connect
        .collection("_weightlift-session")
        .updateOne(
            {date: {$eq : d.toISOString().split("T")[0]}}, 
            { 
            $setOnInsert: {
                day: '',
                status: ''
            } 
            }, 
            {upsert:true}, 
            function (err, res) {
        if (err) throw err;
        response.json(res);
        });
    })
});

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("daily-report-db")

	let start_date = new Date(req.query.start).toLocaleDateString()
    let end_date = new Date(req.query.end).toLocaleDateString()

    console.log(`Retrieving all with dates between ${start_date} - ${end_date}`);

    db_connect
        .collection("_weightlift-session")
        // get between dates
        .find({
            date: {
                $gte: start_date,
                $lte: end_date + 1
            }
        })
        .sort({date : 1})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:date").get(function (req, res) {
    console.log("Retrieving record by date");

    // let parsed_date

    try{
        parsed_date = `${req.params.date.slice(0, 4)}/${req.params.date.slice(4,6)}/${req.params.date.slice(6)}`
    }
    catch {
        res.status(400)
    }

    console.log(`parsed date : ${parsed_date}`)

    let db_connect = dbo.getDb();
    let myquery = { date: parsed_date };
    db_connect.collection("_weightlift-session").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// This section will help you update a record by id.
// FIXME: maybe not needed
recordRoutes.route("/record/update/:id").post(function (req, response) {
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
        .collection("_weightlift-session")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

// This section will help you delete a record
// FIXME: maybe not needed
recordRoutes.route("/record/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("_weightlift-session").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});





module.exports = recordRoutes;

