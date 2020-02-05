const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { emailWelcomeGreet, emailOrName } = require('./Utilities');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const uuidv1 = require('uuid/v1');



var PhotoPostStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/PhotoPosts')
    },
    filename: function (req, file, cb) {
        let temp = uuidv1() + "" + file.originalname.trim();
        cb(null, temp)
    }
})
const PhotoPostUpload = multer({
    storage: PhotoPostStorage,
    limits: { fileSize: 157286400 },
})
var VideoPostStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/VideoPosts')
    },
    filename: function (req, file, cb) {
        let temp = uuidv1() + ".mp4";
        cb(null, temp)
    }
})
const VideoPostUpload = multer({
    storage: VideoPostStorage,
    limits: { fileSize: 157286400 },
})
var AudioPostStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/AudioPosts')
    },
    filename: function (req, file, cb) {
        let temp;
        if (file.mimetype ==="audio/mp3")
        {
            temp = uuidv1() + ".mp3";
        }
        else{
            temp = uuidv1() + "" + file.originalname.trim();

        }
        cb(null, temp)
    }
})
const AudioPostUpload = multer({
    storage: AudioPostStorage,
    limits: { fileSize: 52428800 },
})

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

//PhotoPost
router.put('/uploadPhotoPost', PhotoPostUpload.array('img', 10),(req,res)=>{
    var file = req.files;
    let links=[];
    for (var i = 0; i < file.length; i++) {
        links.push(file[i].path);
    }
    let tag=[];
    let user=[];
    let group=[];
    if(req.body.text.trim()!=="")
    {
        try{
            tag = req.body.text.match(/(^|\s)#(\w+)/g).map(function (v) { return v.trim().substring(1); });
            user = req.body.text.match(/(^|\s)@(\w+)/g).map(function (v) { return v.trim().substring(1); });
            group = req.body.text.match(/(^|\s)&(\w+)/g).map(function (v) { return v.trim().substring(1); });

        }catch(e)
        {

        }
    }
    let newPost=new PostModel({
        username: req.body.username,
        avatar: req.body.avatar,
        time: req.body.time,
        type:2,
        text: req.body.text,
        hashtags: tag,
        usertags: user,
        photosLink: links,
        grouptags:group,
        visible: req.body.visible,
        reactionStat: req.body.reactionStat,
        streams: 0,
        reactionNo:0,
    })

    newPost.save().then((doc)=>{
        res.send({stat:true});
    },(e)=>{
        console.log(e,"Inside Photo Post upload");
        res.send(false);
    });

});


//VideoPost
router.put('/uploadVideoPost', VideoPostUpload.array('vid',1), (req, res) => {
    let link=req.files[0].path;
    let tag = [];
    let user = [];
    let group = [];
    if (req.body.text.trim() !== "") {
        try {
            tag = req.body.text.match(/(^|\s)#(\w+)/g).map(function (v) { return v.trim().substring(1); });
            user = req.body.text.match(/(^|\s)@(\w+)/g).map(function (v) { return v.trim().substring(1); });
            group = req.body.text.match(/(^|\s)&(\w+)/g).map(function (v) { return v.trim().substring(1); });

        } catch (e) {
            console.log(e);
        }
    }
    let newPost = new PostModel({
        username: req.body.username,
        avatar: req.body.avatar,
        time: req.body.time,
        type: 3,
        text: req.body.text,
        hashtags: tag,
        usertags: user,
        videoLink:link,
        grouptags: group,
        visible: req.body.visible,
        reactionStat: req.body.reactionStat,
        streams: 0,
        reactionNo: 0,
    })

    newPost.save().then((doc) => {
        console.log(doc);
        res.send({ stat: true});
    }, (e) => {
        console.log(e, "Inside Vif=deo Post upload");
        res.send(false);
    });

});


//Audio Post
router.put('/uploadAudioPost', AudioPostUpload.array('aud', 2), (req, res) => {
    var file = req.files;
    let links = [];
    for (var i = 0; i < file.length; i++) {
        links.push(file[i].path);
    }
    let tag = [];
    let user = [];
    let group = [];
    if (req.body.text.trim() !== "") {
        try {
            tag = req.body.text.match(/(^|\s)#(\w+)/g).map(function (v) { return v.trim().substring(1); });
            user = req.body.text.match(/(^|\s)@(\w+)/g).map(function (v) { return v.trim().substring(1); });
            group = req.body.text.match(/(^|\s)&(\w+)/g).map(function (v) { return v.trim().substring(1); });

        } catch (e) {

        }
    }
    let newPost = new PostModel({
        username: req.body.username,
        avatar: req.body.avatar,
        time: req.body.time,
        type: 4,
        text: req.body.text,
        hashtags: tag,
        usertags: user,
        coverLink: links[1],
        audioLink: links[0],
        grouptags: group,
        visible: req.body.visible,
        reactionStat: req.body.reactionStat,
        streams: 0,
        reactionNo: 0,
    })

    newPost.save().then((doc) => {
        res.send({ stat: true });
    }, (e) => {
        console.log(e, "Inside Photo Post upload");
        res.send(false);
    });

});


//Text Post
router.post('/uploadTextPost',(req, res) => {
    console.log(req.body)
    let tag = [];
    let user = [];
    let group = [];
    if (req.body.text.trim() !== "") {
        try {
            tag = req.body.text.match(/(^|\s)#(\w+)/g).map(function (v) { return v.trim().substring(1); });
            user = req.body.text.match(/(^|\s)@(\w+)/g).map(function (v) { return v.trim().substring(1); });
            group = req.body.text.match(/(^|\s)&(\w+)/g).map(function (v) { return v.trim().substring(1); });

        } catch (e) {

        }
    }
    let newPost = new PostModel({
        username: req.body.username,
        avatar: req.body.avatar,
        time: req.body.time,
        type: 1,
        text: req.body.text,
        hashtags: tag,
        usertags: user,
        grouptags: group,
        visible: req.body.visible,
        reactionStat: req.body.reactionStat,
        streams: 0,
        reactionNo: 0,
    })

    newPost.save().then((doc) => {
        console.log(doc);
        res.send({ stat: true });
    }, (e) => {
        console.log(e, "Inside Text Post upload");
        res.send(false);
    });

});


module.exports = router;