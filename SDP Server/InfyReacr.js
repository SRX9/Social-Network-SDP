const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { emailWelcomeGreet, emailOrName } = require('./Utilities');
const bcrypt = require('bcryptjs');


//mongod --dbpath C:\Users\SRx\Desktop\Database
//Database models
const {
    FeedsModel, UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");


class InfyReact
{
    constructor(postid) {
        this.postid = postid;
    }
    getReactionsList(resumeId) {
        return "I have a " + this.carname;
    }
}

module.exports={
    InfyReact:InfyReact
}