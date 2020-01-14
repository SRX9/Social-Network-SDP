const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

//file routes

/* authentication routes */
var routes= require('./Auth.js');


//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use("/auth", routes);


app.listen(port,()=>{
    console.log("it's live")
});