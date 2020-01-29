const mongoose = require("mongoose");
const subArraySchema = mongoose.Schema({}, { _id: false });

const networkFanins=mongoose.Schema({
    userid:mongoose.Types.ObjectId,
    username:String,
    fullname:String,
    verify:Boolean,
    avatar:String,
}, { _id: false });

let UserModel = mongoose.model("user", {
  username: {
    index: true,
    unique: true,
    required: true,
    type: String
  },
  password:String,
  inboxid: mongoose.Types.ObjectId,
  fullname: String,
  email: String,
  intro: String,
  country: String,
  region:String,
  state: String,
  fans: Number,
  creationTime: Date,
  fanins: Number,
  group: [subArraySchema],
  NoPost: Number,
  avatar: String,
  coverphotoview: Boolean,
  coverPhoto: String,
  coverVideo: String,
  story: String,
  stalker:Number,
  search:Number,
  monstreams:Number,
  blocked:[subArraySchema]
});

let GroupModel=mongoose.model('group',{
    groupname:{
        index:true,
        unique:true,
        required:true,
        type:String
    },
    creationTime:Date,
    members:[subArraySchema],
    intro:String,
    state:String,
    story:String,
    total:Number,
    avatar:String,
    coverPhoto:String,
    coverVideo:String,
    fans:Number,
    fanins:Number,
    groupType:[subArraySchema],
    nationality:[subArraySchema],

    invited:[subArraySchema],
    requests:[subArraySchema]
});

let UserInbox = mongoose.model("userinbox", {
  userid: mongoose.Types.ObjectId,
  username:String,
  messages:[subArraySchema]
});

let GroupInbox = mongoose.model("groupinbox", {
  groupid: mongoose.Types.ObjectId,
  groupname: String,
  messages: [subArraySchema]
});

let GroupChats = mongoose.model("groupchat", {
  groupid: mongoose.Types.ObjectId,
  groupname: String,
  messages: [subArraySchema]
});

let PostModel=mongoose.model('post',{
    
    postid:mongoose.Types.ObjectId,
    username:String,
    avatar:String,
    time:Date,
    text:{
        type:String,
    },
    hashtags:[subArraySchema],
    usertags:[subArraySchema],
    grouptags:[subArraySchema],
    visible:Number,
    reactionStat:Boolean,
    streams:Number,
    reactions:[subArraySchema]
    
});

let ReactionsModel=mongoose.model('reaction',{
    postid:mongoose.Types.ObjectId,
    userid:mongoose.Types.ObjectId,
    username:String,
    avatar:String,
    text:String,
    reaction:String,
    reply:[subArraySchema],
    like:[subArraySchema]
});

let UserActionsModel=mongoose.model('useraction',{
    userid:mongoose.Types.ObjectId,
    username:String,
    actions:[subArraySchema]
});

let UserNetworkModel=mongoose.model('usernetwork',{

  user:{
    userid:mongoose.Types.ObjectId,
    username:String,
    avatar:String,
  },
  fanins:[networkFanins]
});

let UserTogroupModel=mongoose.model('userTogroup',{
  user:{
    userid:mongoose.Types.ObjectId,
    username:String,
    avatar:String
  },
  group:{
    groupid:mongoose.Types.ObjectId,
    groupname:String,
    avatar:String
  }
});

module.exports={
  UserModel:UserModel,
  GroupModel:GroupModel,
  UserInbox:UserInbox,
  GroupInbox:GroupInbox,
  GroupChats:GroupChats,
  PostModel:PostModel,
  ReactionsModel:ReactionsModel,
  UserActionsModel:UserActionsModel,
  UserNetworkModel:UserNetworkModel,
  UserTogroupModel:UserTogroupModel
}