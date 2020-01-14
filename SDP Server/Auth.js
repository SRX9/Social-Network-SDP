const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const rn = require("random-number");
const {emailWelcomeGreet} =require('./Utilities');
const bcrypt = require('bcryptjs');
const  AVLTree = require("binary-search-tree").AVLTree;

//moongoose setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/ayefan', {
  useCreateIndex: true,
  useNewUrlParser: true
});
//mongod --dbpath C:\Users\SRx\Desktop\Database
//Database models
const {
      UserModel,GroupModel,UserInbox,GroupInbox,GroupChats,PostModel,ReactionsModel,UserActionsModel,UserNetworkModel,UserTogroupModel
} = require("./Models");


//AVL TREE FOR EMAIL AND USERNAME
let avlTree = new AVLTree();
avlTree.insert("raj");
avlTree.insert("rinku");
avlTree.insert("lolo");
//////////**********Login************/////////////

//////////**********Register************/////////////
router.get('/checkUsername',(req,res)=>{
  if (avlTree.search(req.query.username).length===0) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.post('/registerOne',(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  const fullname = req.body.fullname;
  const country = req.body.country;
  const region = req.body.region;
  const email=req.body.email;
  emailWelcomeGreet(email);
  bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          let newUser = new UserModel({
            username: username,
            password: hash,
            fullname: fullname,
            email: email,
            intro: "",
            country: country,
            region: region,
            state: "",
            fans: 0,
            creationTime: new Date(),
            fanins: 0,
            group: [],
            NoPost: 0,
            avatar: "",
            coverphotoview: true,
            coverPhoto: "",
            coverVideo: "",
            story: "",
            blocked: []
          });

          newUser.save().then((data) => {
            avlTree.insert(username);
            res.send({ state: true, data: data });
          }, (e) => {
            console.log(e);
            res.send(false);
          });
        });
  });
});


module.exports = router;