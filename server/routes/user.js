


const express = require("express");

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const userRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

userRoutes.route("/user/add").get(function (req, res) {

})

userRoutes.route("/user/:id").get(function (req, res) {

})

userRoutes.route("/user/update").post(function (req, res) {

})

userRoutes.route("/user/:id").delete(function (req, res) {

})

module.exports = userRoutes;
