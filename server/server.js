const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const recordRoutes = require('./routes/record');
const liftRoutes = require('./routes/lift')
const userRoutes = require('./routes/user')
const programRoutes = require('./routes/program')

app.use(recordRoutes);
app.use(liftRoutes);
app.use(userRoutes);
app.use(programRoutes);

// get driver connection
const dbo = require("./db/conn");
 
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});