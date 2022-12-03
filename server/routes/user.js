const express = require("express");

const userRoutes = express.Router();

// connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

function isAuthenticated(req, res, next) {
    // console.log(req.session)
    if(req.session.user) {
      console.log("Already logged in")
      next()
    }
    else {
      console.log("Redirecting to login");
      res.redirect('/login')
    }
  }

// create a new user.
userRoutes.route("/user/add").post(function (req, response) {
    let db_connect = dbo.getDb();

    console.log(`Adding user: ${req.body}`)
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

// get user that is logged in
// check if session is logged in
// userRoutes.route("/user").get(function (req, res) {
userRoutes.get('/user', isAuthenticated, (req, res) => {
    let db_connect = dbo.getDb("daily-report-db")
    
    db_connect
        .collection("user_data")
        // get between dates
        .findOne({username : {$eq: req.session.user.username}}, 
            function (err, result) {
            if (err) throw err;
            res.json(result);
        });
})

// get a single user by id
userRoutes.route("/user/:id").get(function (req, res) {
    console.log("Retrieving user by id");


    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("user_data").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// update a user by id.
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

// delete a user
userRoutes.route("/user/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("user_data").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});

userRoutes.route("/user/login").get((req, response) => {
    // response.render("/user/login")
    console.log("At login")
    response.json({
        success:true,
        redirectURL: '/user/login'
    })
})



module.exports = userRoutes;

