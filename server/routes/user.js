const express = require("express");

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const userRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you create a new user.
userRoutes.route("/user/add").post(function (req, response) {
    let db_connect = dbo.getDb();

    console.log(req.body)
    let user = req.body

    db_connect
    .collection("user_data")
    .updateOne(
        {username: {$eq : user.username}}, 
        { 
        $setOnInsert: {
            name: user.name,
            program: user.program
        } 
        }, 
        {upsert:true}, 
        function (err, res) {
    if (err) throw err;
    response.json(res);
    });
});

// This section will help you get a list of all the users.
userRoutes.route("/user").get(function (req, res) {
    let db_connect = dbo.getDb("daily-report-db")

    let name = req.query.name
    console.log(`Finding ${name.length > 0 ? name : 'all users'}`)

    db_connect
        .collection("user_data")
        // get between dates
        .find({name : {$eq: name}})
        .sort({username : 1})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you get a single user by id
userRoutes.route("/user/:id").get(function (req, res) {
    console.log("Retrieving user by date");


    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("user_data").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// This section will help you update a user by id.
// FIXME: maybe not needed
userRoutes.route("/user/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: req.body.name,
            username: req.body.username,
            program: req.body.program,
        },
    };
    db_connect
        .collection("user_data")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

// This section will help you delete a user
// FIXME: maybe not needed
userRoutes.route("/user/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("user_data").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});





module.exports = userRoutes;

