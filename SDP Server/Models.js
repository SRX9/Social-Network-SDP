const mongoose = require("mongoose");
const subArraySchema = mongoose.Schema({}, { _id: false });


let UserModel = mongoose.model("user", {
  username: {
    index: true,
    unique: true,
    required: true,
    type: String
  },
  password:String,
  privacy:Number,
  inboxid: mongoose.Types.ObjectId,
  fullname: String,
  email: String,
  phone:Number,
  intro: String,
  country: String,
  verify:Number,
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

let PostModel=mongoose.model('Post',{
    userid:mongoose.Types.ObjectId,
    username:String,
    fullname:String,
    type:Number,
    avatar:String,
    time:Date,
    text:{
        type:String,
    },
    hashtags:Array,
    usertags:Array,
    //photopost
    photosLink: Array,
    //videopost
    videoLink:String,
    player:Number,
    //Audio Post
    coverLink:String,
    audioLink:String,
    //texty
    grouptags:Array,
    visible:Number,
    reactionStat:Boolean,
    reactionNo:Number,
    streams:Number,    
    loves:Number,
    likes:Number,
    firstreaction:{}
});

let ReactionsModel=mongoose.model('reaction',{
    postid:mongoose.Types.ObjectId,
    userid:mongoose.Types.ObjectId,
    username:String,
    avatar:String,
    type:Number,
    verfiy:Number,
    medialink:String,
    time:Date,
    text:String,
    likes:Number,
    likesArray:[String],
    replycount:Number,
});


let ReplyModel=mongoose.model('replies',{
  reactionid: mongoose.Types.ObjectId,
  userid: mongoose.Types.ObjectId,
  type: Number,
  time: Date,
  text: String,
  likes: Number,
  likesArray: [String],
})


let LikeModel=mongoose.model('likes',{
  postid:mongoose.Types.ObjectId,
  userid:[String]
});

let LoveModel = mongoose.model('hearts', {
  postid: mongoose.Types.ObjectId,
  userid: [String]
});

let SaveModel=mongoose.model('save',{
  userid:mongoose.Types.ObjectId,
  postid:[String]
});

let StanModel=mongoose.model('stans',{
  postid:mongoose.Types.ObjectId,
  userid:[String]
});


let UserActionsModel=mongoose.model('useraction',{
    userid:mongoose.Types.ObjectId,
    username:String,
    actions:[subArraySchema]
});

let UserNetworkModel=mongoose.model('usernetwork',{
  userid: mongoose.Types.ObjectId,
  fanins:[String]
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

let FeedsModel=mongoose.model('feeds',{

  userid:mongoose.Types.ObjectId,
  postsid:[String]

});


module.exports={
  //Feeds Statistics
  LikeModel:LikeModel,
  LoveModel:LoveModel,
  StanModel:StanModel,
  SaveModel:SaveModel,
  ReactionsModel: ReactionsModel,
  ReplyModel:ReplyModel,

  //General Model
  UserModel:UserModel,
  GroupModel:GroupModel,
  UserInbox:UserInbox,
  GroupInbox:GroupInbox,
  GroupChats:GroupChats,
  PostModel:PostModel,
  UserActionsModel:UserActionsModel,

  //Netowork Model
  UserNetworkModel:UserNetworkModel,
  UserTogroupModel:UserTogroupModel,
  FeedsModel:FeedsModel
}