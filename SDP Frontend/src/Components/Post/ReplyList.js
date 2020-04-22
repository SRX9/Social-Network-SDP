import React, { useRef, useState } from 'react';
import './Post.css';
import { Row, Col, Avatar, Typography, Icon, Space, Button, message, Divider, Dropdown } from 'antd';
import TimeAgo from 'javascript-time-ago'
import { Link } from 'react-router-dom';
import en from 'javascript-time-ago/locale/en'
import { FaBookmark, FaRegBookmark, FaRegStar, FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import 'antd/dist/antd.css';
import { InView, useInView } from 'react-intersection-observer';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import "video-react/dist/video-react.css";
import { Player, BigPlayButton, ControlBar, LoadingSpinner, VolumeMenuButton, Shortcut } from 'video-react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import SRtext from '../Utilities/SRtext';
import { MdExpandMore } from "react-icons/md";
import Loader from 'react-loader-spinner'
import { IoMdMore } from "react-icons/io";
import Drawer from 'react-drag-drawer';
import Reply from './Reply';


TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const { Text, Title } = Typography;
const serverUrl = "http://localhost:3001/";

let tempre = []

class ReplyList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            my: false,
            delid: null,
            //options
            openoptions: false,
            loadingDel: false,
            youreply: null,
            delid: null,
            replycount: this.props.obj.replycount,
            reaction: this.props.obj,
            replies: [],
            myreplies: [],
            showreply: false,
            replyalltext: "Show all replies",
            repliesLoading: false,
            finish: false,
            loadingmore: false,
            replyopen: false,
            closereply: true,
            avatar: localStorage.getItem("ava") === undefined ? "http://localhost:3001/AF.png" : localStorage.getItem("ava"),
            caption: "",
            likeState: FaRegStar,
            likeColor: "",
            caption: "",
        }
        tempre = this.props.list
    }

    //loading and creating replies
    componentDidMount()
    {
        if(!this.props.first)
        {
            this.setState({ repliesLoading: true })
            axios.get(`${serverUrl}feeds/getInitReplies?reactionid=${this.props.obj._id}`).then((response) => {
                if (response.data.length === this.state.reaction.replycount) {
                    this.setState({ finish: true })
                }

                this.setState({ replies: response.data.slice(0, 2), my: false, closereply: false, repliesLoading: false, showreplies: false })
            }).catch(e => {
                console.log(e);
                this.setState({ repliesLoading: false, showreplies: false })
                message.warning("Unable fetch Replies!! Server Down.", 3)
            })
        }
    }
    loadMore = () => {
        this.setState({ loadingmore: true })
        let lastid = this.state.replies.length;
        axios.get(`${serverUrl}feeds/getChunkReplies?reactionid=${this.props.obj._id}&resumeid=${lastid}`)
            .then((response) => {
                let t = this.state.replies;
                for (let i = 1; i < response.data.length; i++) {
                    t.push(response.data[i])
                }
                console.log(this.state.replies)
                if (this.state.reaction.replycount === this.state.replies.length) {
                    this.setState({ finish: true })
                }
                tempre = t;
                this.setState({ replies: t, loadingmore: false });
            }).catch(e => {
                this.setState({ loadingmore: false })
                message.warning("Unable to Fetch Replies! Try again Later.", 2)
            })
    }
    tagColor = (text) => {
        let temp = text.split(" ");
        var result = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i][0] !== undefined && temp[i][0].trim() === '@' && temp[i].trim().length !== 1) {
                var a = temp[i];
                result.push(" ");
                result.push(<Link to={'/profile/' + a.slice(1)}><span className="myblue pointer" >{a}</span></Link>);
            }
            else if (temp[i][0] !== undefined && temp[i][0].trim() === '#' && temp[i].trim().length !== 1) {
                var a1 = temp[i];
                result.push(" ");
                result.push(<Link to={'/tag/' + a1.slice(1)}><span className="myblue pointer">{a1}</span></Link>);
            }
            else if (temp[i][0] !== undefined && temp[i][0].trim() === '&' && temp[i].trim().length !== 1) {
                var a2 = temp[i];
                result.push(" ");
                result.push(<Link to={'/group/' + a2.slice(1)}><span className="myblue pointer">{a2}</span></Link>);
            }
            else {
                result.push(" ");
                result.push(<span style={{ color: 'black' }}>{temp[i]}</span>);
            }
        }
        return result;
    }
    getCaption = (caption) => {
        this.setState({ caption: caption })
    }
    reply = (caption) => {
        if (this.state.caption.trim() === "") {
            message.warning("Please write a reply!!", 3);
            return;
        }
        axios.post(`${serverUrl}feedstat/uploadReply`, {
            userid: localStorage.getItem('$#@!'),
            reactionid: this.props.obj._id,
            text: caption,
            date: new Date()
        })
            .then((res) => {
                if (res.data.stat) {
                    let temp = this.state.myreplies;
                    temp.push(res.data.obj);
                    let obj = this.state.reaction;
                    obj.replycount++;
                    this.setState({ myreplies: temp},()=>{
                        console.log(this.state.myreplies)
                        this.setState({
                            caption: "", my: true, closereply: false, youreply: res.data.obj,
                            reaction: obj, replyload: false, replyopen: false
                        })
                    })
                }
            })
            .catch((error) => {
                this.setState({ replyload: false, replyopen: false })
                message.warning('Something went Wrong! Try again later', 3);
            });

    }
    showreplies = () => {
        this.setState({ repliesLoading: true })
        axios.get(`${serverUrl}feeds/getInitReplies?reactionid=${this.props.obj._id}`).then((response) => {
            if (response.data.length === this.state.reaction.replycount) {
                this.setState({ finish: true })
            }

            this.setState({ replies: response.data, my: false, closereply: false, repliesLoading: false, showreplies: false })
        }).catch(e => {
            console.log(e);
            this.setState({ repliesLoading: false, showreplies: false })
            message.warning("Unable fetch Replies!! Server Down.", 3)
        })

    }
    showMyReplies = () => {
        this.setState({ repliesLoading: true })
        axios.get(`${serverUrl}feeds/getMyReplies?userid=${localStorage.getItem("$#@!")}&reactionid=${this.props.obj._id}`).then((response) => {
            let t=this.state.myreplies;
            response.data.map(obj=>{
                let flag=false;
                for(let i=0;i<this.state.myreplies.length;i++)
                {
                    if(this.state.myreplies[i]._id===obj._id)
                    {
                        flag=true;
                        break;
                    }
                }
                if(!flag)
                {
                    t.push(obj)
                }
            })
            this.setState({ myreplies: t, my: true, closereply: false, repliesLoading: false, showreplies: false })
        }).catch(e => {
            console.log(e);
            this.setState({ repliesLoading: false, showreplies: false })
            message.warning("Unable fetch Replies!! Server Down.", 3)
        })
    }

    //options to deleter report etc..
    openoptions = (id) => {
        this.setState({ delid: id }, () => {
            this.setState({ openoptions: true })
        })
    }
    deleteReply = (id) => {
        let ttt = this.state.myreplies;
        this.setState({ loadingDel: true });
        axios.get(`${serverUrl}feedstat/delReply?id=${this.state.delid}&reactionid=${this.props.obj._id}`)
            .then((response) => {
                if (response.data) {
                    let temp = [];
                    ttt.map(obj => {
                        if (obj._id !== this.state.delid) {
                            temp.push(obj)
                        }
                    })
                    let t = this.state.reaction;
                    t.replycount--;
                    this.setState({myreplies:temp,my:true},()=>{
                        this.setState({ closereply: true, openoptions: false, reaction: t })
                    })
                    message.success("Reply Deleted Successfully!!!",4);
                    this.setState({ loadingDel: false })

                }
                else {
                    this.setState({ loadingDel: false })
                    message.warning("Something went wrong!!! Try again later.")
                }
            }).catch((e) => {
                console.log(e)
                this.setState({ loadingDel: false })
                message.warning("Something went wrong!!! Try again later.")
            })
    }

    render() {
        const obj = this.state.reaction;
        return (
            <div>
                <div>
                    <Row align="middle" className="pt-2 ">
                        <Col span={24} className="w-100">
                            <div style={{ marginLeft: "55px" }} className="d-inline-block  text-left">
                                <Text strong className="pointer ">{obj.replycount} reply</Text>
                                <br></br>
                                {this.state.closereply ?
                                    <div>
                                        <Text strong onClick={this.showreplies} className="myblue  pointer">All replies</Text>
                                        <Text strong><span className="p-1">&#8226;</span></Text>
                                        <Text strong onClick={this.showMyReplies} className="myblue  pointer">My replies</Text>
                                    </div>
                                    :
                                    <Text strong onClick={() => this.setState({ closereply: true })} className="myblue  pointer">Hide replies</Text>
                                }

                            </div>
                            {!this.state.replyopen ?
                                <div style={{
                                    fontWeight: "400",
                                    paddingTop: "10px",
                                    fontSize: "125%",
                                    marginRight: "7px"
                                }} className="myblue pr-1 dim d-inline-block pointer float-right" onClick={() => this.setState({ replyopen: true })}>
                                    <Icon type="message" theme="filled" /> reply
                                            </div> :
                                <div className="pl-2 pr-2">
                                    <Row align="middle" type="flex" >
                                        <Col xs={2} className=" text-right pr-1" >
                                            <Avatar src={this.state.avatar} size={"large"} />
                                        </Col>
                                        <Col xs={21} className=" text-left">
                                            <SRtext limit={250} done={this.state.caption} rows={1} place={"Write here..."} getCaption={this.getCaption} />
                                        </Col>
                                        <Col xs={1} className="pl-2 text-center pr-1">
                                            <Text strong className="text-danger  pointer link" onClick={() => this.setState({ replyopen: false })} >close</Text>
                                            <br></br>
                                            <Text strong className="myblue pointer link" onClick={() => this.reply(this.state.caption)} >reply</Text>
                                        </Col>

                                    </Row>
                                </div>
                            }

                        </Col>
                    </Row>
                    {!this.state.closereply ? <Row style={{ marginLeft: "55px" }} align="middle" className="pt-2">
                        <Col span={24} className="w-100">
                            {this.state.reaction.replycount === 0 ?
                                !this.state.replyopen?<div className="text-center w-100">No replies
                                    <h6 className="myblue pointer" onClick={() => this.setState({ replyopen: true })}>Give one now!!</h6>
                            </div>:null :
                                this.state.repliesLoading?<div className="text-center p-2 pt-3">
                                    <h6 className="text-black-50">Loading...</h6>
                                </div>:    
                                <div className="">
                                    {this.state.my ? this.state.myreplies < 1 ? 
                                            !this.state.replyopen ?<div className="text-center w-100 p-2 pt-3">
                                        <div className="text-center">
                                                <p className="text-center">No Reply given by you!</p>
                                                <h6 className="myblue text-center pointer" onClick={() => this.setState({ replyopen: true })}>Give one now!!</h6>
                                        </div>
                                    </div>:null : <div>
                                            {this.state.myreplies.map((obj, i) => {
                                                return <div className="border mb-3 msgborder bg-white">
                                                    <Reply type={0} obj={obj} openoptions={this.openoptions} />
                                                </div>
                                            })}
                                        </div> : <div>
                                            {this.state.replies.map((obj, i) => {
                                                return <div className="border mb-3 msgborder bg-light">
                                                    <Reply type={0} obj={obj} openoptions={this.openoptions} />
                                                </div>
                                            })}
                                            {this.state.finish ? <div className="text-center pt-2">
                                                    {!this.state.replyopen ? <div className="text-center w-100">That's it!
                                    <h6 className="myblue pointer" onClick={() => this.setState({ replyopen: true })}>Give one now!!</h6>
                                                    </div> : null}
                                    </div> : <div className="text-center pt-2 ">
                                                    <Text strong onClick={this.loadMore} className="  myblue pointer">load more..</Text>
                                                </div>}
                                        </div>}

                                </div>

                            }
                        </Col>
                    </Row> : null}
                </div>

                <Drawer
                    open={this.state.openoptions}
                    onRequestClose={() => this.setState({ openoptions: false })}
                    modalElementClass=""
                >
                    <div style={{ borderRadius: "25px" }} className="shadow-4 bg-light  border-0 ">
                        <div className="pt-2 text-center border-bottom pb-2">
                            <Text strong >Options</Text>
                        </div>
                        <div className="pt-3 pl-3 pr-3 pb-3" style={{ borderRadius: "25px", width: "15vw" }}>
                            <div className="p-2">
                                <Button className="w-100" shape="round" type="primary">Report</Button>
                            </div>
                            <div className="p-2">
                                <Button shape="round" loading={this.state.loadingDel}
                                    className="w-100" onClick={() => this.deleteReply(this.state.delid)} type="danger">Delete</Button>
                            </div>
                        </div>
                    </div>
                </Drawer>

            </div >
        )
    }
}

export default ReplyList;