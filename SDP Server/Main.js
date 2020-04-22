const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');

//file routes
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/ayefan', {
    useCreateIndex: true,
    useNewUrlParser: true
});

/* authentication routes */
var Authroutes= require('./Auth.js');
var DataFetchrouter=require('./DataFetch');
var Searchrouter=require('./search');
var PostCreateRouter=require('./PostStore');
var EditRouter =require('./Edit');
var NetworkRouter=require('./Fannetwork');
var FeedsRouter=require('./FeedsFetch');
var FeedStat=require('./FeedStats');

//middlewares
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.use("/auth", Authroutes);
app.use("/data", DataFetchrouter);
app.use("/search", Searchrouter);
app.use("/createpost",PostCreateRouter);
app.use("/edit", EditRouter);
app.use("/network", NetworkRouter.router);
app.use("/feeds", FeedsRouter);
app.use("/feedstat", FeedStat);



app.listen(port,()=>{
    console.log("it's live")
});