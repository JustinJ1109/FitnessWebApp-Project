const express = require("express");

// programRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const programRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

function isAuthenticated(req, res, next) {
    if (req.session.username) {
        console.log("Logged in")
        next()
    }
    else {
        console.log("Not logged in")
        res.json({redirectURL:'/user/login'})
    }
}

// This section will help you create a new record.
programRoutes.route("/program/add").post(function (req, response) {
    let db_connect = dbo.getDb();

    console.log(req.body)
    let inc_program = req.body

    console.log("adding program")

    db_connect
    .collection("_volume_map")
    .updateOne(
        {program: {$eq : inc_program.program}, name: {$eq : inc_program.name}, day: {$eq : inc_program.day}}, 
        { 
        $setOnInsert: {
            position: inc_program.position,
            reps : inc_program.reps,
            sets: inc_program.sets,
            weight: inc_program.weight
        } 
        }, 
        {upsert:true}, 
        function (err, res) {
    if (err) throw err;
    response.json(res);
    });
    
});

// This section will help you get a list of all the programs.
// programRoutes.route("/program/getmap/:progname").get(isAuthenticated, function (req, res) {
programRoutes.get('/program/getmap/:progname', (req, res) => {
    let db_connect = dbo.getDb("daily-report-db")

    let dayQuery = req.query.day
    let progname = req.params.progname.toString()

    console.log(`Finding program ${progname} ${dayQuery ? `for day ${dayQuery}` : ''}`)

    if (req.query.day) {
        my_query = {
            program : {$eq: progname},
            day : {$eq : parseInt(dayQuery,10)}
        }
    }
    else {
        my_query = {
            program : {$eq: progname},
        }
    }
    
    db_connect
        .collection("_volume_map")
        // get between dates
        .find(my_query)
        .sort({day:1, position: 1})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
})
    
// });

// This section will help you get a list of all the programs.
// programRoutes.route("/program").get(function (req, res) {
programRoutes.get('/program', isAuthenticated, (req, res) => {
    let db_connect = dbo.getDb("daily-report-db")
    console.log('called /program')
    
    db_connect
    .collection("user_data")
    .findOne({
        name : {$eq: req.session.name}
    }, function (err, result) {
        if (err) throw err;
        console.log("HERE")
        let programname = result.program
        console.log(`prog name ${programname}`)
        
        db_connect
        .collection('_program_library')
        .findOne({
            name : {$eq : programname}
        }, function (err,  result) {
            if (err) throw err;
            console.log(result)
            res.json(result)
        })

    })

})
    
    


//     console.log(`Finding ${name.length > 0 ? name : 'all programs'}`)
//     db_connect
//         .collection("_program_library")
//         // get between dates
//         .find({
//             name : {$eq: name}
//         })
//         .sort({date : 1})
//         .toArray(function (err, result) {
//             if (err) throw err;
//             res.json(result);
//         });
// });

// This section will help you get a single program by id
programRoutes.route("/program/:date").get(function (req, res) {
    console.log("Retrieving program by date");

    try{
        let parsed_date = `${req.params.date.slice(0, 4)}/${req.params.date.slice(4,6)}/${req.params.date.slice(6)}`
    }
    catch {
        res.status(400)
    }

    console.log(`parsed date : ${parsed_date}`)

    let db_connect = dbo.getDb();
    let myquery = { date: parsed_date };
    db_connect.collection("_volume_map").findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// This section will help you update a program by id.
// FIXME: maybe not needed
programRoutes.route("/program/update/:id").post(function (req, response) {
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
        .collection("_volume_map")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            response.json(res);
        });
});

// This section will help you delete a program
// FIXME: maybe not needed
programRoutes.route("/program/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("_volume_map").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});





module.exports = programRoutes;

