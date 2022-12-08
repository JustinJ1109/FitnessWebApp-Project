const express = require("express");

function isAuthenticated(req, res, next) {
    // console.log(req.session)
    if(req.session.user) {
      console.log("Already logged in")
      next()
    }
    else {
      console.log("Redirecting to login");
      res.json({redirectURL:'/user/login'})
    }
  }

const recordRoutes = express.Router();

// connect to the database
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

// create a new record.
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

// get a list of all the records.
// recordRoutes.route("/record").get(isAuthenticated, function (req, res) {
//     let db_connect = dbo.getDb("daily-report-db")

// 	let start_date = new Date(req.query.start).toLocaleDateString()
//     let end_date = new Date(req.query.end).toLocaleDateString()

//     console.log(`Retrieving all with dates between ${start_date} - ${end_date}`);

//     db_connect
//         .collection("_weightlift-session")
//         // get between dates
//         .find({
//             date: {
//                 $gte: start_date,
//                 $lte: end_date + 1
//             }
//         })
//         .sort({date : 1})
//         .toArray(function (err, result) {
//             if (err) throw err;
//             res.json(result);
//         });
// });

// get a single record by id
recordRoutes.route("/record/:date").get(function (req, res) {

    // let parsed_date

    try{
        parsed_date = `${req.params.date.slice(0, 4)}/${req.params.date.slice(4,6)}/${req.params.date.slice(6)}`
    }
    catch {
        res.status(400)
    }

    console.log("/record/:date: Retrieving record by date: " + parsed_date);


    let db_connect = dbo.getDb();
    let myquery = { date: parsed_date };
    db_connect.collection("_weightlift-session").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

module.exports = recordRoutes;

