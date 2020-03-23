const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { search } = require("fast-fuzzy");
const multer = require('multer');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');
let { fannet } = require('./Network');
const {
    LikeModel,LoveModel,StanModel,SaveModel, UserModel, GroupModel, UserInbox, GroupInbox, GroupChats, PostModel, ReactionsModel, UserActionsModel, UserNetworkModel, UserTogroupModel
} = require("./Models");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/ayefan', {
    useCreateIndex: true,
    useNewUrlParser: true
});


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
            res.send(true)
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
                res.send(true)
            }).catch(e => {
                console.log(e, "error creating love model")
            });
        }
        else {
            console.log(data, "loved post");
            res.send(true)
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
            res.send(false);
        });
    }).catch(e => {
        console.log(e, "love post error");
        res.send(false);
    });
});


router.put('/stanPost', (req, res) => {
    console.log("Stanned post", req.body.userid, req.body.postid)
    res.send(true)
});

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


module.exports = router;