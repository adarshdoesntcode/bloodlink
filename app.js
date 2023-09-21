const express = require("express");
const http = require('http');
const socketIo = require('socket.io');

const path = require("path");
const bodyParser = require('body-parser');
const cors = require("cors");
const hbs = require("hbs");
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

//import Models
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const campaignRoute = require("./routes/campaignRoute");
const requestRoute = require("./routes/requestRoute");


const port = process.env.PORT || 3000;

//Define Paths for hbs :Adarsh
const publicDirectoryPath = path.join(__dirname, "/public");
const viewsDirectoryPath = path.join(__dirname, "/templates/views");

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());


//Setup static directory :Adarsh
app.use(express.static(publicDirectoryPath));

//Setup  handlebar and views location and partials :Adarsh
app.set("view engine", "hbs");
app.set("views", viewsDirectoryPath);


io.on('connection', (socket) => {
    console.log('App connected');
  
    // Listen for incoming location data
    socket.on('location', (data) => {
      console.log('Received location:', data);
      
    });
  
    socket.on('disconnect', () => {
      console.log('App disconnected');
    });
  });

server.listen(port, () => {
    console.log(`🚀:Server started on port ${port}`);
});

//Routes
// app.get('/',(req,res)=>{
//     console.log("working");
//     res.render('landingpage')
// })
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/campaign", campaignRoute);
app.use("/request", requestRoute);

module.exports = app;