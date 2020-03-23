const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { emailWelcomeGreet, emailOrName } = require('./Utilities');
const bcrypt = require('bcryptjs');


//moongoose setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/ayefan', {
    useCreateIndex: true,
    useNewUrlParser: true
});


//mongod --dbpath C:\Users\SRx\Desktop\Database
//Database models
const {
  FeedsModel,  UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");

router.get('/userfeeds',(req,res)=>{
  FeedsModel.findOne({ userid:req.query.userid.toString()},"postsid",(err,docs)=>{
     res.send(docs)
  })
})

//get Post Details
router.get('/getpostdetails',(req,res)=>{
  PostModel.findOne({_id:req.query.postid},(err,doc)=>{
    res.send(doc);
  })
})


module.exports = router;