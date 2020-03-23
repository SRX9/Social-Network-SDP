var Graph = require("graphlib").Graph;
var fannet = new Graph({ directed: true, compound: true, multigraph: true });
const express = require("express");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/ayefan', {
    useCreateIndex: true,
    useNewUrlParser: true
});

//Database Models
const {
    FeedsModel, UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");

//Set Nodes
UserModel.find({},"_id username fullname avatar verify ",(err,docs)=>{
    docs.map(obj=>{
        fannet.setNode(obj._id,obj);
    });
});

UserNetworkModel.find({},"userid fanins",(err,docs)=>{
    docs.map(userfans=>{
        userfans.fanins.map(stars=>{
            fannet.setEdge(userfans.userid,stars);
        });
    })
})
setTimeout(()=>{
    console.log(fannet.edges())
},1500)
module.exports={fannet:fannet}