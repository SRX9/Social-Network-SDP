const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { search } = require("fast-fuzzy");


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/ayefan', {
    useCreateIndex: true,
    useNewUrlParser: true
});

//mongod --dbpath C:\Users\SRx\Desktop\Database
//Database models
const {
    UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");

function initBuffers(){}

let usersBuffer = [
  {
    name: "raj",
    avatar:
      "https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzMzODYwMzY2/robert-downey-jr-9542052-1-402.jpg",
    verified: true
  },
  {
    name: "robert Downey",
    avatar:
      "https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzMzODYwMzY2/robert-downey-jr-9542052-1-402.jpg",
    verified: true
  }
];
let tagsBuffer = ["meToo","DollyChallenge","BlackMamba","starboy","myton","sitaraboy","lolMamba"];
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
    res.send(search(req.query.tag,tagsBuffer).slice(0,5));
});

router.get("/user", (req, res) => {
    res.send(search(req.query.user,usersBuffer,{keySelector: (obj) => obj.name}));
});
router.get("/group", (req, res) => {
    res.send(
      search(req.query.group, groupBuffer, { keySelector: obj => obj.name })
    );
});


module.exports = router;