const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { search } = require("fast-fuzzy");
const multer = require('multer');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
var Graph = require("graphlib").Graph;
var fannet = new Graph({ directed: true, compound: true, multigraph: true });
const {
    UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");


//Set Nodes
UserModel.find({}, "_id username fullname avatar verify ", (err, docs) => {
    docs.map(obj => {
        fannet.setNode(obj._id, obj);
    });
});

UserNetworkModel.find({}, "userid fanins", (err, docs) => {
    docs.map(userfans => {
        userfans.fanins.map(stars => {
            fannet.setEdge(userfans.userid, stars);
        });
    })
})
setTimeout(() => {
    console.log(fannet.edges())
}, 1500)

router.put('/fanin',(req,res)=>{
    var star=req.body.star;
    var fan=req.body.fan;
    console.log(star,fan,"star and fan")
    UserModel.findOne({_id:star},(err,docs)=>{
        docs.fans=docs.fans+1;
        docs.save();
        UserModel.findOne({_id:fan},(err,docs)=>{
            docs.fanins=docs.fanins+1;
            UserNetworkModel.updateOne({userid:fan},
                { 
                    $push: { fanins: star } 
                },
            ).then((data)=>{
                console.log(data,"Fanins ");
                docs.save();
                fannet.setEdge(star, fan, "1");
                console.log(fannet.nodes(),"All nodes");
                res.send(true);
            }).catch(e=>{
                console.log(e,"Inside upadting user network model");
                res.send(false);
            })
        }).catch(e=>{
            console.log(e,"Error in fanning in.")
            res.send(false);
        })
    }).catch(e=>{
        console.log(e, "Error in fanning in.")
        res.send(false);
    });
});

router.put('/fanout', (req, res) => {
    var star = req.body.star;
    var fan = req.body.fan;
    UserModel.findOne({ _id: star }, (err, docs) => {
        docs.fans = docs.fans - 1;
        docs.save();
        UserModel.findOne({ _id: fan }, (err, docs) => {
            docs.fanins = docs.fanins - 1;
            UserNetworkModel.update({userid:fan},{
                $pull: { "fanins": star } 
            }).then(data=>{
                console.log(data);
                fannet.removeEdge(star, fan, "1");
                console.log(fannet.nodes());
                res.send(true);
            }).catch(e=>{
                console.log(e,"error in removing fan in");
                req.send(false)
            });
            docs.save();
        }).catch(e => {
            console.log(e, "Error in fanning in.")
            res.send(false);
        })
    }).catch(e => {
        console.log(e, "Error in fanning in.")
        res.send(false);
    });
});


module.exports ={router:router,fannet:fannet};