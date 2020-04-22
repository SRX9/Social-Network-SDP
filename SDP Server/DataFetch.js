const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { emailWelcomeGreet, emailOrName } = require('./Utilities');
const bcrypt = require('bcryptjs');



//mongod --dbpath C:\Users\SRx\Desktop\Database
//Database models
const {
    UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");

//User Profile
router.get('/getUserProfile', (req, res) => {
    UserModel.findOne({ username: req.query.username }, function (err, docs) {
        if (err === null) {
            res.send(docs);
        }
        else {
            res.send(false);
        }
    })
});

//User profile sastar purtu
router.get('/getUserProfileInit',(req,res)=>{
    UserModel.findOne({ _id: req.query.userid },"username fullname avatar verify" ,function (err, docs) {
        if (err === null) {
            res.send(docs);
            console.log(docs)
        }
        else {
            res.send(false);
        }
    })
})

//Posts
router.get('/getPosts', (req, res) => {
    PostModel.find({username:req.query.username}, function (err, docs) {
        if (err===null) {
            res.send(docs.reverse());
        }
        else {
            console.log(err,"Asdsad")
            res.send(false);
        }
    })
});


//fanornot
router.get('/fanornot',(req,res)=>{
    var user=req.query.user;
    var star=req.query.star;
    console.log(user,star)
    UserNetworkModel.findOne({userid:mongoose.Types.ObjectId(user)},(err,data)=>{
        res.send(data.fanins.includes(star))
    });
});

module.exports = router;