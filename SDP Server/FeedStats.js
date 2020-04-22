const express = require("express");
const router = express.Router();
const { search } = require("fast-fuzzy");
const multer = require('multer');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
let { fannet } = require('./Network');
const {
  ReplyModel, LikeModel,LoveModel,StanModel,SaveModel, UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");




var attachStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/React')
    },
    filename: function (req, file, cb) {
        let temp = uuidv1() + "" + file.originalname.trim();
        cb(null, temp)
    }
})
const attachUpload = multer({
    storage: attachStorage,
    limits: { fileSize: 157286400 },
})




//State of Post Stat
router.get('/getstate',(req,res)=>{
    let postid=req.query.postid;
    let userid=req.query.userid;
    var state={ll:0,stan:false,save:false}

    //Get Like State
    LoveModel.findOne({ postid: postid, "userid": userid},(err,doc1)=>{
        if(doc1===null)
        {
            LikeModel.findOne({ postid: postid, "userid": userid }, (err, doc2) => {
                if(doc2===null)
                {
                    state.ll=0;
                }
                else{
                    state.ll=1;
                }
            });
        }
        else{
            state.ll=2
        }
    }).then(()=>{
        StanModel.findOne({ postid: postid, "userid": userid }, (err, doc3) => {
            if (doc3 !== null) {
                state.stan=true
            }
        }).then(()=>{
            SaveModel.findOne({userid:userid,"postid":postid},(err,doc4)=>{
                if (doc4 !== null) {
                    state.save = true
                }
            }).then(()=>{
                console.log(state)
                res.send(state)
            })
        }).catch(e=>{
            console.log(e,"error in getting state of posts")
        })
    });
});


//Like and Dislike
router.put('/diskLikePost',(req,res)=>{
    LikeModel.update({ postid: req.body.postid }, {
        $pull: { "userid": req.body.userid }
    }).then(data => {
        PostModel.findOne({ _id: req.body.postid }, (err, docs) => {
            docs.likes=docs.likes-1;
            docs.save();
        }).then((ok)=>{
            console.log(ok,"post model minus like");
            res.send(true);
        }).catch(e=>{
            res.send(false);
            console.log(e," Error in updating likes of post model");
        });
        console.log(docs,"dis like");
    }).catch(e=>{
        console.log(e, "dis like post error");
    });
});

router.put('/likePost', (req, res) => {
    LikeModel.update({ postid: req.body.postid }, {
        $push: { "userid": req.body.userid }
    }).then(data => {

        if (data.nModified === 0) {
            let newLikeModel = new LikeModel({
                postid: req.body.postid,
                userid: [req.body.userid],

            })
            newLikeModel.save().then((d) => {
                console.log("created like model")
                res.send(true)
            }).catch(e => {
                console.log(e, "error creating like model")
            });
        }
        else {
            console.log(data, "liked post");
        }

        //update number in post
        PostModel.findOne({ _id: req.body.postid }, (err, docs) => {
            docs.likes = docs.likes + 1;
            docs.save();
        }).then((ok) => {
            console.log(ok,"Post Liked");
        }).catch(e => {
            console.log(e, " Error in updating likes of post model from likes");
        });

        //update love model
        LoveModel.update({ postid: req.body.postid }, {
            $pull: { "userid": req.body.userid }
        }).then(data => {
            res.send(true);
        }).catch(e => {
            console.log(e, "like post error from liked");
            res.send(false);
        });
        console.log(data, "like");
    }).catch(e => {
        console.log(e, "like post error");
    });
});


//Heart and Break Heart
router.put('/breakHeartPost', (req, res) => {
    LoveModel.update({ postid: req.body.postid }, {
        $pull: { "userid": req.body.userid }
    }).then(data => {
        //update number in post
        PostModel.findOne({ _id: req.body.postid }, (err, docs) => {
            docs.loves = docs.loves - 1;
            docs.save();
        }).then((ok) => {
            console.log("break loved");
            res.send(true);
        }).catch(e => {
            console.log(e, " Error in updating loves of post model");
        });

    }).catch(e => {
        console.log(e, "loved post error");
        res.send(false);
    });
});

router.put('/heartPost', (req, res) => {
    LoveModel.update({ postid: req.body.postid }, {
        $push: { "userid": req.body.userid }
    }).then(data => {

        if (data.nModified === 0) {
            let newLoveModel = new LoveModel({
                postid: req.body.postid,
                userid: [req.body.userid],
                
            })
            newLoveModel.save().then((d) => {
                console.log("created love model")
            }).catch(e => {
                console.log(e, "error creating love model")
            });
        }
        else {
            console.log(data, "loved post");
        }

        //update number in post
        PostModel.findOne({ _id: req.body.postid }, (err, docs) => {
            docs.loves = docs.loves + 1;
            docs.save();
        }).then((ok) => {
            console.log("Loved \n");
        }).catch(e => {
            console.log(e, " Error in updating loves of post model");
        });

        //Update in like model.
        LikeModel.update({ postid: req.body.postid }, {
            $pull: { "userid": req.body.userid }
        }).then(data => {
            console.log( "dis like");
            res.send(true);
        }).catch(e => {
            console.log(e, "dis like post error from heart");
        });
    }).catch(e => {
        console.log(e, "love post error");
        res.send(false);
    });
});


//Stan Post
router.put('/stanPost', (req, res) => {
    console.log("Stanned post", req.body.userid, req.body.postid)
    StanModel.update({ postid: req.body.postid }, {
        $push: { "userid": req.body.userid }
    }).then(data => {

        //Post Update stan
        PostModel.findOne({ _id: req.body.postid }, (err, docs) => {
            docs.streams = docs.streams + 1;
            docs.save();
        }).then((ok) => {
            console.log("Stanned \n");
            res.send(true)
        }).catch(e => {
            console.log(e, " Error in updating Stan of post model");
            res.send(true)
        });
        console.log(data);
    }).catch((e)=>{
        console.log(e,"error inside stanning post");
        res.send(true);
    });
});


//Post Save
router.put('/savePost', (req, res) => {
    console.log("Saved post", req.body.userid, req.body.postid)
    SaveModel.updateOne({ userid: req.body.userid }, {
        $push: { "postid": req.body.postid }
    }).then(data => {
        if (data.nModified===0)
        {
            let newSaveModel = new SaveModel({
                userid: req.body.userid,
                potsid: [req.body.postid]
            })
            newSaveModel.save().then((d) => {
                console.log("created save model")
                res.send(true)
            }).catch(e => {
                console.log(e, "error creating save model")
            });
        }
        else{
            console.log(data, "saved post");
            res.send(true)
        }
    }).catch(e=>{
        console.log(e,"error in saving the post!!")
        res.send(false);
    });
});

router.put('/unsavePost', (req, res) => {
    console.log("unsaved post", req.body.userid, req.body.postid)
    SaveModel.updateOne({ userid: req.body.userid }, {
        $pull: { "postid": req.body.postid }
    }).then(data => {
        console.log(data, "unsaved post");
        res.send(true);
    }).catch(e => {
        console.log(e, "error in unsaving the post!!")
        res.send(false);
    });
});


//Reaction **************************************

//Get Reaction state per user
router.get('/getReactionstate',(req,res)=>{
    ReactionsModel.findOne({ _id: req.query.reactionid, "likesArray": req.query.userid },(err,doc)=>{
        if(doc===null)
        {
            res.send(false);
        }
        else{
            res.send(true)
        }
    })
})

router.put('/uploadReaction', attachUpload.array('file', 1),(req,res)=>{
        let link="";
        if(req.files[0]!==undefined)
        { 
            link = "http://localhost:3001/" + req.files[0].path.replace(new RegExp(/\\/g), '/');
        }
        let newReaction=new ReactionsModel({
            medialink:link,
            postid:req.body.postid,
            userid:req.body.userid,
            time:req.body.time,
            text: req.body.msg,
            likesArray: [],
            likes:0,
            replycount:0,
            type:req.body.type
        });
        newReaction.save().then(doc=>{
            PostModel.findOne({ _id: req.body.postid }, (err, docs) => {
                docs.reactionNo = docs.reactionNo + 1;
                docs.save();
            }).then((ok) => {
                console.log("Postmodel reaction")
                res.send({ stat: true, obj: doc });
            }).catch(e=>{
                console.log(e,"error in reactionNo++ inside create Reaction")
            })
        },e=>{
            console.log(e,"error in Creating reaction")
            res.send({stat:false,obj:null})
        });
});
//Like reaction
router.put('/likeReaction',(req,res)=>{
    ReactionsModel.updateOne({ _id: req.body.reactionid }, {
        $push: { "likesArray": req.body.userid},
        $inc: {"likes": 1 } 
    }).then(data => {
        console.log(data,"Liked Reaction")
        res.send(true)
    }).catch(e=>{
        console.log(e,"Inside like Reaction Post")
        res.send(true)
    })
});

//dislike Reaction
router.put('/dislikeReaction', (req, res) => {
    ReactionsModel.updateOne({ _id: req.body.reactionid }, {
        $pull: { "likesArray": req.body.userid },
        $inc: { "likes": -1 }
    }).then(data => {
        console.log(data, "DisLiked Reaction");
        res.send(true);
    }).catch(e => {
        console.log(e,"inside dis like reaction")
        res.send(true)
    })
});

//Reply TO Reaction
router.post('/uploadReply',(req, res) => {

    let newReply = new ReplyModel({
        reactionid: req.body.reactionid,
        userid: req.body.userid,
        time:req.body.date,
        text: req.body.text,
        likesArray: [],
        likes: 0,
        type: 1
    });
    newReply.save().then(doc => {
        ReactionsModel.findOne({ _id: req.body.reactionid }, (err, docs) => {
            docs.replycount = docs.replycount + 1;
            docs.save();
        }).then((ok) => {
            console.log("Reaction model reply")
            res.send({ stat: true, obj: doc });
        })
    }, e => {
        console.log(e, "error in Creating reply ")
        res.send({ stat: false, obj: null })
    });
});


//***********************Reply**********************************************
//Like reaction reply
router.put('/likeReply', (req, res) => {
    ReplyModel.updateOne({ _id: req.body.replyid }, {
        $push: { "likesArray": req.body.userid },
        $inc: { "likes": 1 }
    }).then(data => {
        console.log(data, "Liked Reply")
        res.send(true)
    }).catch(e => {
        console.log(e, "Inside like Reply Post")
        res.send(true)
    })
});

//dislike Reaction reply
router.put('/dislikeReply', (req, res) => {
    ReplyModel.updateOne({ _id: req.body.replyid }, {
        $pull: { "likesArray": req.body.userid },
        $inc: { "likes": -1 }
    }).then(data => {
        console.log(data, "DisLiked Reply");
        res.send(true);
    }).catch(e => {
        console.log(e, "inside dis like reply")
        res.send(true)
    })
});

//Get Reply State per user
router.get('/getReplystate', (req, res) => {
    ReplyModel.findOne({ _id: req.query.replyid, "likesArray": req.query.userid }, (err, doc) => {
        if (doc === null) {
            res.send(false);
        }
        else {
            res.send(true)
        }
    })
})


//************************delete reaction or reply******************/
//del reply
router.get('/delReply',(req,res)=>{
        ReplyModel.deleteOne({ _id: req.query.id }, function (err, result) {
            if (err) {
                res.send(false);
                console.log(e, "Error inside Reply delete ")
            } else {
                console.log(result,"reply deleted")
                ReactionsModel.updateOne({ _id: req.query.reactionid }, {
                    $inc: { "replycount": -1 }
                }).then(data => {
                    console.log(data,"Reply count minus")
                    res.send(true);
                }).catch(e=>{
                    res.send(false);
                    console.log(e,"Error inside Reply delete number post model")
                })
            }
        })
})

//del reaction
router.get('/delReaction', (req, res) => {
    ReactionsModel.deleteOne({ _id: req.query.id }, function (err, result) {
        if (err) {
            res.send(false);
            console.log(e, "Error inside Reaction delete ")
        } else {
            PostModel.findOne({ _id: req.query.postid }, (err, docs) => {
                docs.reactionNo = docs.reactionNo - 1;
                docs.save();
            }).then((ok) => {
                ReplyModel.deleteMany({ reactionid: req.query.id }, function (err, data) {
                    if (err) {
                        console.log(e, "Error inside deltet all replis ")
                        res.send(true);
                    } else {
                        res.send(true);
                    }
                }).catch(e => {
                    console.log(e, "Error inside deltet all replis ")
                    res.send(true);
                })
            }).catch(e => {
                res.send(false)
                console.log(e, "Error inside Reply delete number post model")
            })
        }
    })
})
module.exports = router;