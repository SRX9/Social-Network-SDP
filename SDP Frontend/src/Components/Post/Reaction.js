import React, { useRef, useState } from 'react';
import './Post.css';
import { Row, Col, Avatar, Typography, Icon, Space, message, Divider } from 'antd';
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

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const { Text, Title } = Typography;
const serverUrl = "http://localhost:3001/";

class Reaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reaction: this.props.obj,
            replies: [],
            showreply: false,
            replyalltext: "Show all replies",
            repliesLoading: false,
            finish: false,
            loadingmore: false,
            replyopen: false,
            closereply: true,
            //like
            likeState: FaRegStar,
            likeColor: "",
            caption: "",
            loading: false,
            avatar: localStorage.getItem("ava") === undefined ? "http://localhost:3001/AF.png" : localStorage.getItem("ava")
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        axios.get(`${serverUrl}data/getUserProfileInit?userid=${this.props.obj.userid}`).then((response) => {
            let temp = this.state.reaction;
            if (response.data) {
                temp.username = response.data.username;
                temp.avatar = response.data.avatar;
                temp.verify = response.data.verify;
                console.log(temp);
                this.setState({ reaction: temp, loading: false })
                //getting state
                if (this.props.type === 0) {
                    axios.get(`${serverUrl}feedstat/getReplystate?userid=${localStorage.getItem('$#@!')}&replyid=${this.props.obj._id}`)
                        .then((res) => {
                            if (res.data) {
                                this.setState({
                                    likeState: FaStar,
                                    likeColor: "myblue",
                                    loading: false
                                })
                            }
                        })
                }
                else {
                    axios.get(`${serverUrl}feedstat/getReactionstate?userid=${localStorage.getItem('$#@!')}&reactionid=${this.props.obj._id}`)
                        .then((res) => {
                            if (res.data) {
                                this.setState({
                                    likeState: FaStar,
                                    likeColor: "myblue",
                                    loading: false
                                })
                            }
                        })
                }

            }
            else {
                temp.type = 0;
                this.setState({ reaction: temp, loading: false });
            }
        })
    }

    like = () => {
        if (this.state.likeColor === "") {
            let temp = this.state.reaction;
            temp.likes++;
            this.setState({
                likeState: FaStar,
                likeColor: "myblue",
                reaction: temp
            })
            setTimeout(() => this.finallike(), 3000);
        }
        else {
            let temp = this.state.reaction;
            temp.likes--;
            this.setState({
                likeState: FaRegStar,
                likeColor: "",
                reaction: temp

            })
            setTimeout(() => this.finaldislike(), 3000);
        }

    }

    finaldislike = () => {
        if (this.state.likeColor === "") {
            if (this.props.type === 0) {
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/dislikeReply',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        replyid: this.props.obj._id
                    }
                })
            }
            else {
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/dislikeReaction',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        reactionid: this.props.obj._id
                    }
                })
            }

        }
    }
    finallike = () => {
        if (this.state.likeColor === "myblue") {
            if (this.props.type === 0) {
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/likeReply',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        replyid: this.props.obj._id
                    }
                })
            }
            else {
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/likeReaction',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        reactionid: this.props.obj._id
                    }
                })
            }

        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.obj !== this.props.obj) {
            this.setState({ reaction: this.props.obj });
            this.setState({ loading: true })
            axios.get(`${serverUrl}data/getUserProfileInit?userid=${this.props.obj.userid}`).then((response) => {
                let temp = this.state.reaction;
                if (response.data) {
                    temp.username = response.data.username;
                    temp.avatar = response.data.avatar;
                    temp.verify = response.data.verify;
                    console.log(temp);
                    this.setState({ reaction: temp, loading: false })
                    //getting state
                    if (this.props.type === 0) {
                        axios.get(`${serverUrl}feedstat/getReplystate?userid=${localStorage.getItem('$#@!')}&replyid=${this.props.obj._id}`)
                            .then((res) => {
                                if (res.data) {
                                    this.setState({
                                        likeState: FaStar,
                                        likeColor: "myblue",
                                        loading: false
                                    })
                                }
                            })
                    }
                    else {
                        axios.get(`${serverUrl}feedstat/getReactionstate?userid=${localStorage.getItem('$#@!')}&reactionid=${this.props.obj._id}`)
                            .then((res) => {
                                if (res.data) {
                                    this.setState({
                                        likeState: FaStar,
                                        likeColor: "myblue",
                                        loading: false
                                    })
                                }
                            })
                    }

                }
                else {
                    temp.type = 0;
                    this.setState({ reaction: temp, loading: false });
                }
            })
        }
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
        console.log(caption)
        this.setState({ caption: caption })
    }

    reply = () => {
        if (this.state.caption.trim() === "") {
            message.warning("Please write a reply!!", 3);
            return;
        }
        axios.post(`${serverUrl}feedstat/uploadReply`, {
            userid: localStorage.getItem('$#@!'),
            reactionid: this.props.obj._id,
            text: this.state.caption,
            date: new Date()
        })
            .then((res) => {
                if (res.data.stat) {
                    let temp = this.state.replies;
                    temp.unshift(res.data.obj);
                    let obj = this.state.reaction;
                    obj.replycount++;
                    this.setState({ replies: temp, reaction: obj, replyload: false, replyopen: false })
                }
            })
            .catch((error) => {
                this.setState({ replyload: false, replyopen: false })
                message.warning('Something went Wrong! Try again later', 3);
            });

    }

    showreplies = () => {
        if (this.state.replies.length !== 0) {
            this.setState({ closereply: false, repliesLoading: false, showreplies: false });
            return;
        }
        this.setState({ repliesLoading: true })
        axios.get(`${serverUrl}feeds/getInitReplies?reactionid=${this.props.obj._id}`).then((response) => {
            if (response.data.length === this.state.reaction.replycount) {
                this.setState({ finish: true })
            }
            this.setState({ replies: response.data, closereply: false, repliesLoading: false, showreplies: false })
        }).catch(e => {
            this.setState({ repliesLoading: false, showreplies: false })
            message.warning("Unable fetch Replies!! Server Down.", 3)
        })
    }
    loadMore = () => {
        this.setState({ loadingmore: true })
        let lastid = this.state.replies[this.state.replies.length - 1]._id;
        axios.get(`${serverUrl}feeds/getChunkReplies?reactionid=${this.props.obj._id}&resumeid=${lastid}`)
            .then((response) => {
                let t = this.state.replies;
                for (let i = 1; i < response.data.length; i++) {
                    t.push(response.data[i])
                }
                if (t.length === this.state.replies.length) {
                    this.setState({ finish: true })
                }
                this.setState({ replies: t, loadingmore: false });
            }).catch(e => {
                this.setState({ loadingmore: false })
                message.warning("Unable to Fetch Replies! Try again Later.", 2)
            })
    }


    render() {
        if (this.state.loading) {
            return <div className="border br p-4 text-center mb-3">Loading</div>
        }
        else {
            const obj = this.state.reaction;
            if (obj.type === 1) {
                return (
                    <div className="mb-3 text-left  ">
                        <Row justify="space-around" className="p-1" align="middle">
                            <Col span={12} className="text-left p-2">
                                <Row type="flex" align="middle">
                                    <Col flex="auto" >
                                        <Avatar className="d-inline-block" src={obj.avatar} size={"large"} />
                                    </Col>
                                    <Col flex="auto" className="pl-1">
                                        <Row type="flex" align="middle">
                                            <Col flex="auto">
                                                <Text strong className="username text-dark">{obj.username}</Text>
                                            </Col>

                                        </Row>

                                        <Row type="flex" style={{ marginTop: "-5px" }}>
                                            <Col flex="auto">
                                                <Text type="secondary" className="time">{timeAgo.format(Date.now() - (new Date().getTime() - new Date(obj.time).getTime()))}</Text>
                                            </Col>

                                        </Row>
                                    </Col>

                                </Row>
                            </Col>
                            <Col span={12} className=" p-2" >
                                <Row type="flex" align="middle" className="float-right text-right" style={{ marginBottom: "-5px" }}>
                                    <Col flex="auto" >
                                        <div style={{
                                            fontWeight: "500",
                                            fontSize: "160%",
                                            marginTop: "2px"
                                        }} className="myblue float-right pointer pr-2 pt-1 ">
                                            <this.state.likeState onClick={this.like} className={this.state.likeColor + " grow "} />
                                        </div>
                                    </Col>
                                    <Col flex="auto">
                                        <Text strong className="pointer">{obj.likes} </Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row    >
                            <Col xs={24} className="reacttext">
                                <div>
                                    <Text strong className="text-black" >
                                        {this.tagColor(obj.text)}
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                        {this.props.type !== 0 ?
                            <div>
                                <Row align="middle" className="pt-2 ">
                                    <Col span={24} className="w-100">
                                        <div style={{ marginLeft: "55px" }} className="d-inline-block  text-left">
                                            <Text strong className="pointer ">{obj.replycount} reply</Text>
                                            <br></br>
                                            {this.state.closereply ?
                                                <Text strong onClick={this.showreplies} className="myblue  pointer">Show all replies</Text>
                                                :
                                                <Text strong onClick={() => this.setState({ closereply: true })} className="myblue  pointer">Hide all replies</Text>
                                            }
                                        </div>
                                        {!this.state.replyopen ?
                                            <div style={{
                                                fontWeight: "400",
                                                paddingTop: "10px",
                                                fontSize: "125%"
                                            }} className="myblue dim d-inline-block pointer float-right" onClick={() => this.setState({ replyopen: true })}>
                                                <Icon type="message" theme="filled" /> reply
                                    </div> :
                                            <div className="">
                                                <Row align="middle" type="flex" >
                                                    <Col xs={2} className=" text-right pr-1" >
                                                        <Avatar src={this.state.avatar} size={"large"} />
                                                    </Col>
                                                    <Col xs={21} className=" text-left">
                                                        <SRtext limit={250} done={this.state.caption} rows={1} place={"Write here..."} getCaption={this.getCaption} />
                                                    </Col>
                                                    <Col xs={1} className="pl-2 text-center">
                                                        <Text strong className="text-danger  pointer link" onClick={() => this.setState({ replyopen: false })} >close</Text>
                                                        <br></br>
                                                        <Text strong className="myblue pointer link" onClick={this.reply} >reply</Text>
                                                    </Col>

                                                </Row>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                                {!this.state.closereply ? <Row style={{ marginLeft: "55px" }} align="middle" className="pt-2">
                                    <Col span={24} className="w-100">
                                        {this.state.reaction.replycount === 0 ?
                                            <div>No replies</div> :
                                            <div className="">
                                                {this.state.replies.map((obj, i) => {
                                                    return <div style={{ borderRadius: "0px 25px 25px" }} className="bg-light border  temp1   mb-4 ">
                                                        <Reaction type={0} obj={obj} key={i} /></div>
                                                })}

                                                {this.state.finish ?
                                                    <div className="text-center p-2">
                                                        That's it for now!
                                            </div> :
                                                    this.state.loadingmore ?
                                                        <div className="text-center p-2" style={{ fontSize: "150%" }}>
                                                            <Loader
                                                                type="Puff"
                                                                color="#00bfff"
                                                                height={100}
                                                                width={100}
                                                            //3 secs

                                                            />
                                                        </div> :
                                                        <div className="text-center p-2 pointer grow">
                                                            <MdExpandMore onClick={this.loadMore} style={{ fontSize: "350%" }} />
                                                        </div>}
                                            </div>}
                                    </Col>
                                </Row> : null}
                            </div> : null}
                    </div>
                )
            }
            else if (obj.type === 2) {
                return (

                    <div className="mb-3 text-left  ">
                        <Row justify="space-around" className="p-1" align="middle">
                            <Col span={12} className="text-left p-2">
                                <Row type="flex" align="middle">
                                    <Col flex="auto" >
                                        <Avatar className="d-inline-block" src={obj.avatar} size={"large"} />
                                    </Col>
                                    <Col flex="auto" className="pl-1">
                                        <Row type="flex" align="middle">
                                            <Col flex="auto">
                                                <Text strong className="username text-dark">{obj.username}</Text>
                                            </Col>

                                        </Row>

                                        <Row type="flex" style={{ marginTop: "-5px" }}>
                                            <Col flex="auto">
                                                <Text type="secondary" className="time">{timeAgo.format(Date.now() - (new Date().getTime() - new Date(obj.time).getTime()))}</Text>
                                            </Col>

                                        </Row>
                                    </Col>

                                </Row>
                            </Col>
                            <Col span={12} className=" p-2" >
                                <Row type="flex" align="middle" className="float-right text-right" style={{ marginBottom: "-5px" }}>
                                    <Col flex="auto" >
                                        <div style={{
                                            fontWeight: "500",
                                            fontSize: "160%",
                                            marginTop: "2px"
                                        }} className="myblue float-right pointer pr-2 pt-1 ">
                                            <this.state.likeState onClick={this.like} className={this.state.likeColor + " grow "} />
                                        </div>
                                    </Col>
                                    <Col flex="auto">
                                        <Text strong className="pointer">{obj.likes} </Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row    >
                            <Col xs={24} className="reacttext">
                                <div>
                                    <Text strong className="text-black" >
                                        {this.tagColor(obj.text)}
                                    </Text>
                                </div>

                                <div className="reactimagecenter">
                                    <img src={obj.medialink} className="img-fluid reactimage" />
                                </div>
                            </Col>
                        </Row>
                        {this.props.type !== 0 ?
                            <div>
                                <Row align="middle" className="pt-2 ">
                                    <Col span={24} className="w-100">
                                        <div style={{ marginLeft: "55px" }} className="d-inline-block  text-left">
                                            <Text strong className="pointer ">{obj.replycount} reply</Text>
                                            <br></br>
                                            {this.state.closereply ?
                                                <Text strong onClick={this.showreplies} className="myblue  pointer">Show all replies</Text>
                                                :
                                                <Text strong onClick={() => this.setState({ closereply: true })} className="myblue  pointer">Hide all replies</Text>
                                            }
                                        </div>
                                        {!this.state.replyopen ?
                                            <div style={{
                                                fontWeight: "400",
                                                paddingTop: "10px",
                                                fontSize: "125%"
                                            }} className="myblue dim d-inline-block pointer float-right" onClick={() => this.setState({ replyopen: true })}>
                                                <Icon type="message" theme="filled" /> reply
                                    </div> :
                                            <div className="">
                                                <Row align="middle" type="flex" >
                                                    <Col xs={2} className=" text-right pr-1" >
                                                        <Avatar src={this.state.avatar} size={"large"} />
                                                    </Col>
                                                    <Col xs={21} className=" text-left">
                                                        <SRtext limit={250} done={this.state.caption} rows={1} place={"Write here..."} getCaption={this.getCaption} />
                                                    </Col>
                                                    <Col xs={1} className="pl-2 text-center">
                                                        <Text strong className="text-danger  pointer link" onClick={() => this.setState({ replyopen: false })} >close</Text>
                                                        <br></br>
                                                        <Text strong className="myblue pointer link" onClick={this.reply} >reply</Text>
                                                    </Col>

                                                </Row>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                                {!this.state.closereply ? <Row style={{ marginLeft: "55px" }} align="middle" className="pt-2">
                                    <Col span={24} className="w-100">
                                        {this.state.reaction.replycount === 0 ?
                                            <div>No replies</div> :
                                            <div className="">
                                                {this.state.replies.map((obj, i) => {
                                                    return <div style={{ borderRadius: "0px 25px 25px" }} className="bg-light border  temp1   mb-4 ">
                                                        <Reaction type={0} obj={obj} key={i} /></div>
                                                })}

                                                {this.state.finish ?
                                                    <div className="text-center p-2">
                                                        That's it for now!
                                                    </div> :
                                                    this.state.loadingmore ?
                                                        <div className="text-center p-2" style={{ fontSize: "150%" }}>
                                                            <Loader
                                                                type="Puff"
                                                                color="#00bfff"
                                                                height={100}
                                                                width={100}
                                                            //3 secs

                                                            />
                                                        </div> :
                                                        <div className="text-center p-2 pointer grow">
                                                            <MdExpandMore onClick={this.loadMore} style={{ fontSize: "350%" }} />
                                                        </div>}
                                            </div>}
                                    </Col>
                                </Row> : null}
                            </div> : null}
                    </div>
                )
            }
            else if (obj.type === 3) {
                return (
                    <div className="mb-3 text-left  ">
                        <Row justify="space-around" className="p-1" align="middle">
                            <Col span={12} className="text-left p-2">
                                <Row type="flex" align="middle">
                                    <Col flex="auto" >
                                        <Avatar className="d-inline-block" src={obj.avatar} size={"large"} />
                                    </Col>
                                    <Col flex="auto" className="pl-1">
                                        <Row type="flex" align="middle">
                                            <Col flex="auto">
                                                <Text strong className="username text-dark">{obj.username}</Text>
                                            </Col>

                                        </Row>

                                        <Row type="flex" style={{ marginTop: "-5px" }}>
                                            <Col flex="auto">
                                                <Text type="secondary" className="time">{timeAgo.format(Date.now() - (new Date().getTime() - new Date(obj.time).getTime()))}</Text>
                                            </Col>

                                        </Row>
                                    </Col>

                                </Row>
                            </Col>
                            <Col span={12} className=" p-2" >
                                <Row type="flex" align="middle" className="float-right text-right" style={{ marginBottom: "-5px" }}>
                                    <Col flex="auto" >
                                        <div style={{
                                            fontWeight: "500",
                                            fontSize: "160%",
                                            marginTop: "2px"
                                        }} className="myblue float-right pointer pr-2 pt-1 ">
                                            <this.state.likeState onClick={this.like} className={this.state.likeColor + " grow "} />
                                        </div>
                                    </Col>
                                    <Col flex="auto">
                                        <Text strong className="pointer">{obj.likes} </Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row    >
                            <Col xs={24} className="reacttext">
                                <div>
                                    <Text strong className="text-black" >
                                        {this.tagColor(obj.text)}
                                    </Text>
                                </div>

                                <div className="reactionvideo">
                                    <Player
                                        playsInline
                                        className="reactionvideo"
                                        poster="/assets/poster.png"
                                        src={obj.medialink}
                                    >
                                        <Shortcut clickable={true} />
                                        <LoadingSpinner />
                                        <VolumeMenuButton disabled />

                                        <ControlBar autoHide={true} autoHideTime={true}>
                                        </ControlBar>
                                        <BigPlayButton position="center" />
                                    </Player>
                                </div>
                            </Col>
                        </Row>
                        {this.props.type !== 0 ?
                            <div>
                                <Row align="middle" className="pt-2 ">
                                    <Col span={24} className="w-100">
                                        <div style={{ marginLeft: "55px" }} className="d-inline-block  text-left">
                                            <Text strong className="pointer ">{obj.replycount} reply</Text>
                                            <br></br>
                                            {this.state.closereply ?
                                                <Text strong onClick={this.showreplies} className="myblue  pointer">Show all replies</Text>
                                                :
                                                <Text strong onClick={() => this.setState({ closereply: true })} className="myblue  pointer">Hide all replies</Text>
                                            }
                                        </div>
                                        {!this.state.replyopen ?
                                            <div style={{
                                                fontWeight: "400",
                                                paddingTop: "10px",
                                                fontSize: "125%"
                                            }} className="myblue dim d-inline-block pointer float-right" onClick={() => this.setState({ replyopen: true })}>
                                                <Icon type="message" theme="filled" /> reply
                                    </div> :
                                            <div className="">
                                                <Row align="middle" type="flex" >
                                                    <Col xs={2} className=" text-right pr-1" >
                                                        <Avatar src={this.state.avatar} size={"large"} />
                                                    </Col>
                                                    <Col xs={21} className=" text-left">
                                                        <SRtext limit={250} done={this.state.caption} rows={1} place={"Write here..."} getCaption={this.getCaption} />
                                                    </Col>
                                                    <Col xs={1} className="pl-2 text-center">
                                                        <Text strong className="text-danger  pointer link" onClick={() => this.setState({ replyopen: false })} >close</Text>
                                                        <br></br>
                                                        <Text strong className="myblue pointer link" onClick={this.reply} >reply</Text>
                                                    </Col>

                                                </Row>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                                {!this.state.closereply ? <Row style={{ marginLeft: "55px" }} align="middle" className="pt-2">
                                    <Col span={24} className="w-100">
                                        {this.state.reaction.replycount === 0 ?
                                            <div>No replies</div> :
                                            <div className="">
                                                {this.state.replies.map((obj, i) => {
                                                    return <div style={{ borderRadius: "0px 25px 25px" }} className="bg-light border  temp1   mb-4 ">
                                                        <Reaction type={0} obj={obj} key={i} /></div>
                                                })}

                                                {this.state.finish ?
                                                    <div className="text-center p-2">
                                                        That's it for now!
                                                    </div> :
                                                    this.state.loadingmore ?
                                                        <div className="text-center p-2" style={{ fontSize: "150%" }}>
                                                            <Loader
                                                                type="Puff"
                                                                color="#00bfff"
                                                                height={100}
                                                                width={100}
                                                            //3 secs

                                                            />
                                                        </div> :
                                                        <div className="text-center p-2 pointer grow">
                                                            <MdExpandMore onClick={this.loadMore} style={{ fontSize: "350%" }} />
                                                        </div>}
                                            </div>}
                                    </Col>
                                </Row> : null}
                            </div> : null}</div>
                )
            }
            else if (obj.type === 4) {
                return (
                    <div className="mb-3 text-left  ">
                        <Row justify="space-around" className="p-1" align="middle">
                            <Col span={12} className="text-left p-2">
                                <Row type="flex" align="middle">
                                    <Col flex="auto" >
                                        <Avatar className="d-inline-block" src={obj.avatar} size={"large"} />
                                    </Col>
                                    <Col flex="auto" className="pl-1">
                                        <Row type="flex" align="middle">
                                            <Col flex="auto">
                                                <Text strong className="username text-dark">{obj.username}</Text>
                                            </Col>

                                        </Row>

                                        <Row type="flex" style={{ marginTop: "-5px" }}>
                                            <Col flex="auto">
                                                <Text type="secondary" className="time">{timeAgo.format(Date.now() - (new Date().getTime() - new Date(obj.time).getTime()))}</Text>
                                            </Col>

                                        </Row>
                                    </Col>

                                </Row>
                            </Col>
                            <Col span={12} className=" p-2" >
                                <Row type="flex" align="middle" className="float-right text-right" style={{ marginBottom: "-5px" }}>
                                    <Col flex="auto" >
                                        <div style={{
                                            fontWeight: "500",
                                            fontSize: "160%",
                                            marginTop: "2px"
                                        }} className="myblue float-right pointer pr-2 pt-1 ">
                                            <this.state.likeState onClick={this.like} className={this.state.likeColor + " grow "} />
                                        </div>
                                    </Col>
                                    <Col flex="auto">
                                        <Text strong className="pointer">{obj.likes} </Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row    >
                            <Col xs={24} className="reacttext">
                                <div>
                                    <Text strong className="text-black" >
                                        {this.tagColor(obj.text)}
                                    </Text>
                                </div>


                                <div className="pt-1 pb-1 audioreaction">
                                    <audio controls className="w-100 " src={obj.medialink} controlsList="nodownload" />
                                </div>
                            </Col>
                        </Row>
                        {this.props.type !== 0 ?
                            <div>
                                <Row align="middle" className="pt-2 ">
                                    <Col span={24} className="w-100">
                                        <div style={{ marginLeft: "55px" }} className="d-inline-block  text-left">
                                            <Text strong className="pointer ">{obj.replycount} reply</Text>
                                            <br></br>
                                            {this.state.closereply ?
                                                <Text strong onClick={this.showreplies} className="myblue  pointer">Show all replies</Text>
                                                :
                                                <Text strong onClick={() => this.setState({ closereply: true })} className="myblue  pointer">Hide all replies</Text>
                                            }
                                        </div>
                                        {!this.state.replyopen ?
                                            <div style={{
                                                fontWeight: "400",
                                                paddingTop: "10px",
                                                fontSize: "125%"
                                            }} className="myblue dim d-inline-block pointer float-right" onClick={() => this.setState({ replyopen: true })}>
                                                <Icon type="message" theme="filled" /> reply
                                    </div> :
                                            <div className="">
                                                <Row align="middle" type="flex" >
                                                    <Col xs={2} className=" text-right pr-1" >
                                                        <Avatar src={this.state.avatar} size={"large"} />
                                                    </Col>
                                                    <Col xs={21} className=" text-left">
                                                        <SRtext limit={250} done={this.state.caption} rows={1} place={"Write here..."} getCaption={this.getCaption} />
                                                    </Col>
                                                    <Col xs={1} className="pl-2 text-center">
                                                        <Text strong className="text-danger  pointer link" onClick={() => this.setState({ replyopen: false })} >close</Text>
                                                        <br></br>
                                                        <Text strong className="myblue pointer link" onClick={this.reply} >reply</Text>
                                                    </Col>

                                                </Row>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                                {!this.state.closereply ? <Row style={{ marginLeft: "55px" }} align="middle" className="pt-2">
                                    <Col span={24} className="w-100">
                                        {this.state.reaction.replycount === 0 ?
                                            <div>No replies</div> :
                                            <div className="">
                                                {this.state.replies.map((obj, i) => {
                                                    return <div style={{ borderRadius: "0px 25px 25px" }} className="bg-light border  temp1   mb-4 ">
                                                        <Reaction type={0} obj={obj} key={i} /></div>
                                                })}

                                                {this.state.finish ?
                                                    <div className="text-center p-2">
                                                        That's it for now!
                                                    </div> :
                                                    this.state.loadingmore ?
                                                        <div className="text-center p-2" style={{ fontSize: "150%" }}>
                                                            <Loader
                                                                type="Puff"
                                                                color="#00bfff"
                                                                height={100}
                                                                width={100}
                                                            //3 secs

                                                            />
                                                        </div> :
                                                        <div className="text-center p-2 pointer grow">
                                                            <MdExpandMore onClick={this.loadMore} style={{ fontSize: "350%" }} />
                                                        </div>}
                                            </div>}
                                    </Col>
                                </Row> : null}
                            </div> : null}</div>)
            }
        }
    }
}


export default Reaction; 
