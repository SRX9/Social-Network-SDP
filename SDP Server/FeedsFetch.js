const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { emailWelcomeGreet, emailOrName } = require('./Utilities');
const bcrypt = require('bcryptjs');



//mongod --dbpath C:\Users\SRx\Desktop\Database
//Database models
const {
 ReplyModel, FeedsModel,  UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
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





//get all reactions
router.get('/getInitReaction',(req,res)=>{
  ReactionsModel.find({ "postid": req.query.postid }).sort([['likes', -1],['replycount',-1]])
    .limit(3)
    .exec(function (err, docs) {
      if(err)
      {
        res.send(false)
      }
      else{
        res.send(docs)
      }
    });
})


router.get('/getChunkReactions',async (req,res)=>{
  var postid=req.query.postid;
  var skipid=req.query.resumeid;
  ReactionsModel.find({ "postid": postid }).sort([['likes', -1], ['replycount', -1]]).skip(parseInt(skipid))
    .limit(9)
    .exec(function (err, docs) {
      if (err) {
        console.log(err)
        res.send(false)
      }
      else {
        res.send(docs)
      }
    });
})


//get all replies
router.get('/getInitReplies', (req, res) => {
  ReplyModel.find({ "reactionid": req.query.reactionid }).sort([['likes', -1]])
    .limit(4)
    .exec(function (err, docs) {
      if (err) {
        res.send(false)
      }
      else {
        res.send(docs)
      }
    });
})


router.get('/getChunkReplies', async (req, res) => {
  var reactionid = req.query.reactionid;
  var skipid = req.query.resumeid;
  console.log(reactionid,skipid)
  ReplyModel.find({ "reactionid": reactionid }).sort([['likes', -1]]).skip(parseInt(skipid-1))
    .limit(4)
    .exec(function (err, docs) {
      if (err) {
        console.log(err)
        res.send(false)
      }
      else {
        res.send(docs)
      }
    });
})

router.get('/getMyReplies',(req,res)=>{
  ReplyModel.find({ "userid": req.query.userid,"reactionid":req.query.reactionid })
    .exec(function (err, docs) {
      if (err) {
        res.send(false)
      }
      else {
        res.send(docs)
      }
    });
})
module.exports = router;