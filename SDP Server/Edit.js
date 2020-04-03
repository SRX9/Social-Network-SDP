const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { search } = require("fast-fuzzy");
const multer = require('multer');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');



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
    limits: { fileSize: 52428800 },
})
var VideoPostStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/VideoPosts')
    },
    filename: function (req, file, cb) {
        let temp = uuidv1() + "" + file.originalname.trim();
        cb(null, temp)
    }
})
const VideoPostUpload = multer({
    storage: VideoPostStorage,
    limits: { fileSize: 524288000 },
})

//mongod --dbpath C:\Users\SRx\Desktop\Database
//Database models
const {
    UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");

//Cover User Photo
router.put('/EditCoverPhotoUser',PhotoPostUpload.array('img',1), (req,res)=>{
    let link = "http://localhost:3001/" +req.files[0].path.replace(new RegExp(/\\/g), '/');
    let username=req.body.username;
    UserModel.findOne({ username: username }, function (err, doc) {
        doc.coverPhoto = link;
        console.log(link);
        doc.save();
        res.send(link);
    }).catch(e=>{
        console.log(e,"Inside Cover photo change");
        res.send(false)
    });
});

//Cover User Video
router.put('/EditCoverVideoUser', VideoPostUpload.array('vid', 1), (req, res) => {
    let link = "http://localhost:3001/" + req.files[0].path.replace(new RegExp(/\\/g), '/');
    let username = req.body.username;
    UserModel.findOne({ username: username }, function (err, doc) {
        doc.coverVideo = link;
        console.log(link);
        doc.save();
        res.send(link);
    }).catch(e => {
        console.log(e, "Inside Cover Video change");
        res.send(false)
    });
});

//need optimization 
router.put('/EditUserDetail', PhotoPostUpload.array('avatar', 1), (req, res) => {
    let link="";
    if(req.files.length!==0)
    {
        link = "http://localhost:3001/" + req.files[0].path.replace(new RegExp(/\\/g), '/');
    }
    UserModel.findOne({ _id: req.body.userid}, function (err, doc) {
        if (req.files.length>=1)
        {
            doc.avatar = link
            PostModel.updateMany({ userid: req.body.userid }, { $set: { avatar: link } }).then(doc => {
                console.log("avatar Modified in Posts");
            })
        }
        PostModel.updateMany({ userid: req.body.userid }, { $set: { username: req.body.username } }).then(doc=>{
            console.log("username Modified in Posts");
        })
        PostModel.updateMany({ userid: req.body.userid }, { $set: { fullname: req.body.fullname } }).then(doc => {
            console.log("fullname Modified in Posts");
        })
        doc.username=req.body.username,
        doc.fullname=req.body.fullname,
        doc.intro=req.body.bio,
        doc.country=req.body.country,
        doc.region=req.body.region
        doc.save();
        res.send(doc);
    }).catch(e => {
        console.log(e, "Inside User Details change");
        res.send(false)
    });
});

router.put('/EditContactDetail',(req,res)=>{
    UserModel.findOne({ _id: req.body.userid }, function (err, doc) {
            doc.email = req.body.email,
            doc.phone=req.body.phone,
        doc.save();
        res.send({stat:true,obj:doc});
    }).catch(e => {
        console.log(e, "Inside Conatact Details change");
        res.send({stat:false})
    });

});

router.post('/checkOldPassword',(req,res)=>{
    UserModel.findOne({ _id: req.body.userid }, 'password', function (err, docs) {
        if (err === null) {
            bcrypt.compare(req.body.password, docs.password, function (err, response) {
                res.send(response);
            });
        }
        else {
            res.send("error");
        }
    })
});

router.put('/updatePassword',(req,res)=>{
    console.log(req.body.newpassword)
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.newpassword, salt, function (err, hash) {
            UserModel.findOne({ _id: req.body.userid }, function (err, doc) {
                doc.password=hash;
                doc.save().then(()=>{
                    res.send(true);
                });
            }).catch(e=>{
                console.log(e, "Inside update password change");
                res.send(false)
            })
        })
    })

});

router.put('/updateAccountPrivacy',(req,res)=>{
    UserModel.findOne({ _id: req.body.userid }, function (err, doc) {
        doc.privacy = req.body.newprivacy,
        doc.save();
        res.send(true);
    }).catch(e => {
        console.log(e, "Inside update privacy change");
        res.send(false)
    });
})


module.exports = router;