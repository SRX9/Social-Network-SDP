const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { search } = require("fast-fuzzy");
const Fuse =require('fuse.js');
const options = {
  isCaseSensitive: false,
  findAllMatches: false,
  includeMatches: false,
  includeScore: false,
  useExtendedSearch: false,
  minMatchCharLength: 1,
  shouldSort: true,
  threshold:0.5,
  location: 0,
  distance: 100,
  keys: [
    "name",
    "fullname"
  ]
};

//mongod --dbpath C:\Users\SRx\Desktop\Database
//Database models
const {
    UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");

let usersBuffer = [];

function initBuffers(){
  UserModel.find({},"username fullname coverPhoto verify avatar",(err,docs)=>{
    docs.map(obj=>{
      usersBuffer.push({
        name: obj.username,
        verified:obj.verify,
        avatar:obj.avatar,
        fullname:obj.fullname,
        cover: obj.coverPhoto
      })
    })
  })
}
let fuse;
initBuffers()
setTimeout(()=>{
  fuse = new Fuse(usersBuffer, options);
  //console.log(usersBuffer)
},1500)
let stagsBuffer = [{  
  by: "raj",
  name:"lola",
  avatar:
    "https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzMzODYwMzY2/robert-downey-jr-9542052-1-402.jpg",
  number:13364
},
  {
    by: "raju",
    name: "mamba",
    avatar:
      "https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzMzODYwMzY2/robert-downey-jr-9542052-1-402.jpg",
    number: 13364
  },
  {
    by: "rajww",
    name: "dakota",
    avatar:
      "https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzMzODYwMzY2/robert-downey-jr-9542052-1-402.jpg",
    number: 13364
  },];
let groupBuffer = [
  {
    name: "blackpink",
    avatar:
      "https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzMzODYwMzY2/robert-downey-jr-9542052-1-402.jpg",
    verified: true
  },
  {
    name: "beatles",
    avatar:
      "https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzMzODYwMzY2/robert-downey-jr-9542052-1-402.jpg",
    verified: true
  }
];

router.get('/tag', (req, res) => {
  res.send(search(req.query.tag,tagsBuffer, { keySelector: (obj) => obj.name }).slice(0, 5));
});

router.get("/user", (req, res) => {
    res.send(search(req.query.user,usersBuffer,{keySelector: (obj) => obj.name}).slice(0,5));
});
router.get("/group", (req, res) => {
    res.send(
      search(req.query.group, groupBuffer, { keySelector: obj => obj.name }).slice(0,5)
    );
});


//Search
//Users
router.get('/finduser',(req,res)=>{
  res.send(fuse.search(req.query.token).slice(0,20))
})

//inc serach
router.get('/incSearch',(req,res)=>{
  console.log(req.query.userid)
  UserModel.findOne({_id:req.query.userid},(err,docs)=>{
    docs.search=docs.search+1
    docs.save();
    res.send(true);
  },e=>{
    console.log(e,"Error in search increase");
    res.send(true)
  })
})
module.exports = router;