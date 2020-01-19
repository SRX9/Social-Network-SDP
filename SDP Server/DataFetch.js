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
    UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");

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


module.exports = router;