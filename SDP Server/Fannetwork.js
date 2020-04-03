const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { search } = require("fast-fuzzy");
const multer = require('multer');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
let {fannet} =require('./Network');
const {
    UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");


//mongod --dbpath C:\Users\SRx\Desktop\Database
//fan-in


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


module.exports = router;