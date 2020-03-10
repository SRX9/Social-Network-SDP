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


module.exports = router;