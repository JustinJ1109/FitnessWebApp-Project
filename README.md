# FitnessWebApp-Project

# Description
A web application that allows users to create and track their workouts and progress.


# Setup
- Clone this repository
- [Install npm](https://www.npmjs.com/package/npm) if not already installed
- [Install node.js](https://nodejs.org/en/download/) if not already installed
- Navigate to server/ and create a `config.env` file. Here, you must specify your MongoDB credentials to connect to the database.
  - paste the following
```
  ATLAS_URI=mongodb+srv://professor-guest:kSkqrdn40PAV2oH7@cluster0.4bfk4mr.mongodb.net/?retryWrites=true&w=majority
  PORT=5000
```
- run `cd client && npm install && npm start` in terminal from root
- open a new terminal window and run `cd server && node server.js`
