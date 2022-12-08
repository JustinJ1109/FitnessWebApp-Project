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
    console.log("program authenticating")
    // console.log(req.session)
    if (req.session.user || true) {
        console.log("Logged in")
        next()
    }
    else {
        console.log("Not logged in")
        res.json({redirectURL:'/user/login'})
    }
}

// This section will help you create a new record.
//TODO: not used
programRoutes.route("/program/add").post(function (req, response) {
    let db_connect = dbo.getDb();

    console.log("** Adding Program **")
    console.log(req.body)
    let inc_program = req.body


    db_connect
    .collection("_volume_map")
    .updateOne(
        {program: {$eq : inc_program.program}, name: {$eq : inc_program.name}, day: {$eq : inc_program.day}}, 
        { 
        $setOnInsert: {
            position: inc_program.position,
            reps : inc_program.reps,
            sets: inc_program.sets,
            weight: inc_program.weight,
            ref: inc_program.ref
        } 
        }, 
        {upsert:true}, 
        function (err, res) {
    if (err) throw err;
    response.json(res);
    });
    
});

/*
 Gets the map of all exercises for each day in the program by name

 If day query is provided, will only look for those that match that day
 (used for daily, if omitted, used for calendar)
 */
programRoutes.get('/program/getmap', async (req, res) => {
    let db_connect = dbo.getDb("daily-report-db")

    let dayQuery = req.query.day

    console.log(`/program/getmap: Finding program ${dayQuery ? `for day ${dayQuery}` : ''}`)
    
    var promise = new Promise((resolve, reject) => {
        db_connect.collection('user_data').findOne({name : {$eq: 'Justin'}},
        function(err, res) {
            if (err) throw err;
            console.log("RESSS")
            console.log(res.program)

            if (dayQuery) {
                db_connect.collection('_program_library')
                .findOne({name : {$eq : res.program}},
                function (err, res) {
                    console.log("SUBRESS")
                    console.log(res)
                    if (err) {reject(err)};
    
                    resolve({
                        program: {$eq : res.name},
                        day: {$eq : res.days[parseInt(dayQuery, 10)]}
                    })
                })
            }
    
            else {
                resolve({
                    program: {$eq: res.program}
                })
            }
        })
        
        
    });

    try {
        const my_query = await promise;
        db_connect.collection('_volume_map')
        .find(my_query)
        .sort({day:1, position: 1})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result)
        })
    } catch (err) {
        throw err;
    }
    
    
})
    
/*
Gets the program name and days map of the logged in user 


*/
programRoutes.get('/program', isAuthenticated, (req, res) => {
    let db_connect = dbo.getDb("daily-report-db")
    
    db_connect.collection("user_data")
    .findOne({
        name : {$eq: "Justin"}
    }, function (err, result) {
        if (err) throw err;
        let programname = result.program
        console.log(`/program: name ${programname}`)
        
        db_connect
        .collection('_program_library')
        .findOne({
            name : {$eq : programname}
        }, function (err,  result) {
            if (err) throw err;
            res.json(result)
        })
    })
})

programRoutes.get('/get-programs', (req, res) => {
    let db_connect = dbo.getDb("daily-report-db")
    
    
    db_connect.collection('_program_library')
        .find({})
        .sort({name:1, custom:-1})
        .toArray(function (err, result) {
            if (err) throw err;
            console.log(result)
            console.log('/get-programs ^')


            res.json(result)
        })
    
})

// This section will help you update a program by id.
// FIXME: maybe not needed
programRoutes.route("/program/update").post(function (req, response) {
    let db_connect = dbo.getDb();

    let dayQuery = req.query.date
    let exercise = req.query.exercise
    let set = req.query.set

    let myquery = { date: dayQuery };
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

programRoutes.route("/program/record-status", (req, response) => {

})





module.exports = programRoutes;

