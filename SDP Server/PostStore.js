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
    limits: { fileSize: 257286400 },
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
    limits: { fileSize: 1181116010 },
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

//Database Models
const {
   LikeModel,LoveModel,SaveModel,StanModel ,FeedsModel, UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");




function NotifyAll(id,postid)
{
    let obj = require('./Fannetwork');
    let fannet=obj.fannet;
    let fans=fannet.inEdges(id);
    console.log(fans,"ganeshasdsad");
    fans.map(fanid=>{
        FeedsModel.updateOne({ userid:mongoose.Types.ObjectId(fanid.v) },
            {
                $push:
                    { postsid: postid }
            }).then(doc=>{
                console.log(doc,"post feed");
            }).catch(e => {
                console.log(e, "Inside Notifying all Fans on Posts")
            });
    })
}

function InitPostStat(postid)
{
    let newLike=new LikeModel({
        postid:postid,
        userid:[]
    });
    newLike.save().then(()=>{console.log("Like Model Created")}).catch(e=>console.log("e,error in creating like Model"))

    let newLove = new LoveModel({
        postid: postid,
        userid: []
    });
    newLove.save().then(() => { console.log("Love Model Created") }).catch(e => console.log("e,error in creating like Model"))

    let newStan = new StanModel({
        postid: postid,
        userid: []
    });
    newStan.save().then(() => { console.log("stan Model Created") }).catch(e => console.log("e,error in creating like Model"))

}

//PhotoPost
router.put('/uploadPhotoPost', PhotoPostUpload.array('img', 10),(req,res)=>{
    var file = req.files;
    let links=[];
    for (var i = 0; i < file.length; i++) {
        links.push("http://localhost:3001/" + file[i].path.replace(new RegExp(/\\/g), '/'));
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
        userid:req.body.userid,
        username: req.body.username,
        fullname:req.body.fullname,
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
        loves: 0,
        likes: 0
    })

    newPost.save().then((doc)=>{

        //notifying all fans
        NotifyAll(req.body.userid,doc._id);
        InitPostStat(doc._id);    

        res.send({stat:true});
    },(e)=>{
        console.log(e,"Inside Photo Post upload");
        res.send(false);
    });

});


//VideoPost
router.put('/uploadVideoPost', VideoPostUpload.array('vid',1), (req, res) => {
    let link="http://localhost:3001/" + req.files[0].path.replace(new RegExp(/\\/g), '/');
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
        fullname: req.body.fullname,
        time: req.body.time,
        type: 3,
        text: req.body.text,
        hashtags: tag,
        player: req.body.playerType,
        usertags: user,
        videoLink:link,
        grouptags: group,
        visible: req.body.visible,
        reactionStat: req.body.reactionStat,
        streams: 0,
        reactionNo: 0,
        loves: 0,
        likes: 0
    })

    newPost.save().then((doc) => {
        console.log(doc);

        //notifying all fans
        NotifyAll(req.body.userid, doc._id)
        InitPostStat(doc._id);    

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
        links.push("http://localhost:3001/" + file[i].path.replace(new RegExp(/\\/g), '/'));
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
        userid: req.body.userid,
        username: req.body.username,
        avatar: req.body.avatar,
        fullname: req.body.fullname,
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
        loves: 0,
        likes: 0
    })

    newPost.save().then((doc) => {

        //notifying all fans
        NotifyAll(req.body.userid, doc._id)
        InitPostStat(doc._id);    

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
        userid:req.body.userid,
        username: req.body.username,
        avatar: req.body.avatar,
        time: req.body.time,
        fullname: req.body.fullname,
        type: 1,
        text: req.body.text,
        hashtags: tag,
        usertags: user,
        grouptags: group,
        visible: req.body.visible,
        reactionStat: req.body.reactionStat,
        streams: 0,
        reactionNo: 0,
        loves: 0,
        likes: 0
    })

    newPost.save().then((doc) => {
        //notifying all fans
        NotifyAll(req.body.userid, doc._id);
        InitPostStat(doc._id);    


        res.send({ stat: true });
    }, (e) => {
        console.log(e, "Inside Text Post upload");
        res.send(false);
    });

});


module.exports = router;
