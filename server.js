//for connecting to the database using moongoose
const mongoose = require('mongoose');
//helps to access the environment variables stored in .env file
const dotenv = require('dotenv');

const app = require("./app");
//dotenv loads the environment variables from a .env file to the process.env

dotenv.config();

// console.log("Server.js");

const DB = process.env.DB;
// console.log(DB);

//connecting database
mongoose.connect(DB).then(() => {
    console.log("Database connection successful");
}).catch((e) => {
    console.log(`Database connection fails! ${e}`)
});


// //connecting to port 3000
// const PORT = process.env.PORT;

// app.listen(PORT, () => {
//     console.log(`App is running in port ${PORT}`);
// });