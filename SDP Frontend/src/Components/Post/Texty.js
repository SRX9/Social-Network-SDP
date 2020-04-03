import React, { useRef } from 'react';
import './Post.css';
import { Row, Col, Avatar, Typography, Icon, message, Modal, Divider } from 'antd';
import TimeAgo from 'javascript-time-ago'
import { Link } from 'react-router-dom';
import en from 'javascript-time-ago/locale/en'
import { FaBookmark, FaRegBookmark, FaRegStar, FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import 'antd/dist/antd.css';
import { InView, useInView } from 'react-intersection-observer';
import axios from 'axios';
import Reaction from './Reaction';
import CreateReaction from './CreateReaction';
import Drawer from 'react-drag-drawer'
import AllReactions from './AllReactions';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const { Text, Title } = Typography;
const serverUrl = "http://localhost:3001/";


export default class Texty extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:true,

            post: this.props.obj,

            stat: 0,
            
            //stan
            stan: false,
            stantime:2000,
            stanclass:"stan1",
            stillStanned: false,

            //save
            saveState: FaRegBookmark,
            saveColor: "",

            //like
            likeState: FaRegStar,
            likeColor: "",

            //love
            loveState: FaRegHeart,
            loveColor: "",

            //reaction  
            reactIcon: "https://img.icons8.com/material-outlined/50/000000/speech-bubble.png",
            openall:false

        }
    }

    componentDidMount() {
        let stantime = ((this.props.obj.text.length) * 1000) / 30;
        this.setState({stantime:stantime<1000?2000:stantime,loading:true})
        
        axios.get(`${serverUrl}feedstat/getstate?userid=${localStorage.getItem('$#@!')}&postid=${this.props.obj._id}`)
            .then((response) => {
                if (response.data.ll === 0) {
                    this.setState({
                        likeState: FaRegStar,
                        likeColor: "",
                        loveState: FaRegHeart,
                        loveColor: "",
                        stat: 0
                    })
                }
                else if (response.data.ll === 1) {
                    this.setState({
                        likeState: FaStar,
                        likeColor: "myblue",
                        loveState: FaRegHeart,
                        loveColor: "",
                        stat: 1
                    })
                }
                else if (response.data.ll === 2) {
                    this.setState({
                        likeState: FaRegStar,
                        likeColor: "",
                        loveState: FaHeart,
                        loveColor: "myblue",
                        stat: 2
                    })
                } 

                this.setState({ stan: response.data.stan },()=>{
                    if(response.data.stan)
                    {
                        this.setState({stan:true,  stanclass: "stan2" })
                    }
                    this.setState({loading: false})
                })
                if (response.data.save) {
                    this.setState({ saveState: FaBookmark, saveColor: "text-dark" })
                }
            })
    }

    tagColor = (text) => {
        let temp = text.split(" ");
        var result = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i][0] !== undefined && temp[i][0].trim() === '@' && temp[i].trim().length !== 1) {
                var a = temp[i];
                result.push(" ");
                result.push(<Link to={'/profile/' + a} key={i+""+this.state.post._id}><span className="myblue pointer"  >{a}</span></Link>);
            }
            else if (temp[i][0] !== undefined && temp[i][0].trim() === '#' && temp[i].trim().length !== 1) {
                var a1 = temp[i];
                result.push(" ");
                result.push(<Link to={'/tag/' + a1} key={i + "" + this.state.post._id}><span className="myblue pointer">{a1}</span></Link>);
            }
            else if (temp[i][0] !== undefined && temp[i][0].trim() === '&' && temp[i].trim().length !== 1) {
                var a2 = temp[i];
                result.push(" ");
                result.push(<Link to={'/group/' + a2} key={i + "" + this.state.post._id}><span className="myblue pointer">{a2}</span></Link>);
            }
            else {
                result.push(" ");
                result.push(<span style={{ color: 'black' }} key={i + "" + this.state.post._id}>{temp[i]}</span>);
            }
        }
        return result;
    }

    StanStart = (inv) => {
        this.setState({stillStanned:true});
        if(!this.state.stan)
        {
            setTimeout(() => {
                if (this.state.stillStanned) {
                    axios({
                        method: 'put',
                        url: serverUrl + 'feedstat/stanPost',
                        data: {
                            userid: localStorage.getItem('$#@!'),
                            postid: this.props.obj._id
                        }
                    }).then(res => {
                        if (!res.data) {
                            message.warning('Server Down!! Please Try again Later');
                        }
                        else {
                            let temp = this.state.post;
                            temp.streams++;
                            this.setState({ stan: true, post: temp,stanclass:"stan2" })
                        }
                    }).catch(e => {
                        message.warning('Server Down!! Please Try again Later');
                    });
                }
            }, this.state.stantime)
        }

    }

    LikeorLove = (what) => {
        if (what === 1) {
            if (this.state.likeState === FaStar) {
                let temp = this.state.post;
                temp.likes--
                this.setState({
                    likeState: FaRegStar,
                    likeColor: "",
                    loveState: FaRegHeart,
                    loveColor: "",
                    post: temp
                });
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/diskLikePost',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        postid: this.props.obj._id
                    }
                }).then(res => {
                    if (!res.data) {
                        message.warning('Server Down!! Please Try again Later');
                    }
                }).catch(e => {
                    message.warning('Server Down!! Please Try again Later');
                });
            }
            else {
                let temp = this.state.post;
                temp.likes++
                if (this.state.ll === 2 || this.state.loveState == FaHeart) {
                    temp.loves--;
                    axios({
                        method: 'put',
                        url: serverUrl + 'feedstat/breakHeartPost',
                        data: {
                            userid: localStorage.getItem('$#@!'),
                            postid: this.props.obj._id
                        }
                    }).then(res => {
                        if (!res.data) {
                            message.warning('Server Down!! Please Try again Later');
                        }
                    }).catch(e => {
                        message.warning('Server Down!! Please Try again Later');
                    });
                }
                this.setState({
                    likeState: FaStar,
                    likeColor: "myblue",
                    loveState: FaRegHeart,
                    loveColor: "",
                    post: temp
                });
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/likePost',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        postid: this.props.obj._id
                    }
                }).then(res => {
                    if (!res.data) {
                        message.warning('Server Down!! Please Try again Later');
                    }
                }).catch(e => {
                    message.warning('Server Down!! Please Try again Later');
                });
            }

        }
        else if (what === 2) {
            let temp = this.state.post;
            if (this.state.loveState === FaHeart) {
                temp.loves--
                this.setState({
                    likeState: FaRegStar,
                    likeColor: "",
                    loveState: FaRegHeart,
                    loveColor: "",
                    post: temp
                });
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/breakHeartPost',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        postid: this.props.obj._id
                    }
                }).then(res => {
                    if (!res.data) {
                        message.warning('Server Down!! Please Try again Later');
                    }
                }).catch(e => {
                    message.warning('Server Down!! Please Try again Later');
                });
            }
            else {
                let temp = this.state.post;
                temp.loves++
                if (this.state.stat === 1 || this.state.likeState === FaStar) {
                    temp.likes--
                    axios({
                        method: 'put',
                        url: serverUrl + 'feedstat/diskLikePost',
                        data: {
                            userid: localStorage.getItem('$#@!'),
                            postid: this.props.obj._id
                        }
                    }).then(res => {
                        if (!res.data) {
                            message.warning('Server Down!! Please Try again Later');
                        }
                    }).catch(e => {
                        message.warning('Server Down!! Please Try again Later');
                    });
                }
                this.setState({
                    likeState: FaRegStar,
                    likeColor: "",
                    loveState: FaHeart,
                    loveColor: "myblue",
                    post: temp
                });
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/heartPost',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        postid: this.props.obj._id
                    }
                }).then(res => {
                    if (!res.data) {
                        message.warning('Server Down!! Please Try again Later');
                    }
                }).catch(e => {
                    message.warning('Server Down!! Please Try again Later');
                });
            }

        }
    }

    save = () => {
        if (this.state.saveState == FaRegBookmark) {
            this.setState({ saveState: FaBookmark, saveColor: "text-dark" })
            axios({
                method: 'put',
                url: serverUrl + 'feedstat/savePost',
                data: {
                    userid: localStorage.getItem('$#@!'),
                    postid: this.props.obj._id
                }
            }).then(res => {
                if (!res.data) {
                    message.warning('Server Down!! Please Try again Later');
                }
            }).catch(e => {
                message.warning('Server Down!! Please Try again Later');
            });
        }
        else {
            this.setState({ saveState: FaRegBookmark, saveColor: "" })
            axios({
                method: 'put',
                url: serverUrl + 'feedstat/unsavePost',
                data: {
                    userid: localStorage.getItem('$#@!'),
                    postid: this.props.obj._id
                }
            }).then(res => {
                if (!res.data) {
                    message.warning('Server Down!! Please Try again Later');
                }
            }).catch(e => {
                message.warning('Server Down!! Please Try again Later');
            });
        }
    }


    openreaction=(id)=>{
        this.props.openreaction(id);
    }

    render() {

        const post = this.state.post;
        if(this.state.loading)
        {
            return(
                <div>
                    <h1 className="text-center p-5 border br">Loading</h1>
                </div>
            )
        }
        return (
            <div className="postcard mb-4 pb-2 bg-white" >
                <Row  justify="space-around" className="p-1" align="middle">
                    <Col span={12} className="text-left p-2">
                        <Row type="flex">
                            <Col flex="auto" >
                                <Link to={'/profile/' + post.username}>
                                    <Avatar className="d-inline-block" src={post.avatar} size={"large"} />
                                </Link>
                            </Col>
                            <Col flex="auto" className="pl-1">
                                <Row type="flex" style={{ marginBottom: "-5px" }}>
                                    <Col flex="auto">
                                        <Link to={'/profile/' + post.username}>
                                            <Text strong className="username text-dark">{post.username}</Text>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "-5px" }}>
                                    <Col flex="auto">
                                        <Text type="secondary" className="time">{timeAgo.format(Date.now() - (new Date().getTime() - new Date(post.time).getTime()))}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} className="float-right p-2" >
                        <div className="mt-2">
                            <span>
                                <this.state.saveState onClick={this.save} className={this.state.saveColor + " pointer float-right saveicon"} />
                            </span>
                        </div>
                    </Col>
                </Row>
                <Row >
                    <Col xs={24} className="text-left ">
                        <div className="texty border-top pl-3 p-2">
                            {this.tagColor(post.text)}
                        </div>
                    </Col>
                </Row>
                <Row  type="flex" justify="space-around" className=" pt-3 " align="middle">
                    <Col xs={8} className=" text-left pl-3 ">
                        <div className=" "><span className=' font-weight-bold stannum ' >{post.streams}</span> <b className={this.state.stanclass +" stans"}>Stan</b></div>
                    </Col>
                    <Col xs={8} className="text-center text-break">
                        <Row type="flex" justify="center" align="middle" style={{ marginBottom: "-7px" }}>
                            <Col className="pr-2 pb-2">
                                <div>
                                <this.state.likeState onClick={() => this.LikeorLove(1)} className={this.state.likeColor + " grow icon likeicon"} />
                                </div>
                            </Col>
                            <Col className="pl-2 pb-2">
                                <div>
                                    <this.state.loveState onClick={() => this.LikeorLove(2)} className={this.state.loveColor + " grow icon loveicon"} />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={8} className="text-right pr-1 pb-2">
                        <div>
                            <Avatar src={this.state.reactIcon} className="grow pointer  likeicon" 
                            onClick={()=>this.openreaction(post._id)} />
                        </div>
                    </Col>
                </Row>
                <Row  className="ml-3 text-left pt-2 mr-3 mb-2 border-top">
                    <Col xs={24}>
                        <div>
                            <Link className="userlink myblue" to={'/profile/' + post.username}>{post.fullname}</Link>
                            <span className="p-1 pl-2 stat">&#8226;</span>
                            <span className="p-1 stat">{post.likes} like</span>
                            <span className="p-1 pb-1 stat">&#8226;</span>
                            <span className="p-1 stat">{post.loves} heart</span>
                        </div>
                        <div className="pt-2">
                            <Row align="middle">
                                <Col span={12} className="text-left">
                                    <h6 className="reaction"><span className='text-dark font-weight-bold ' style={{ fontSize: "120%" }} >{post.reactionNo}</span> Reactions</h6>
                                </Col>
                                <Col span={12} className="text-right">
                                    <h6 className="reaction myblue pointer" onClick={()=>this.setState({openall:true})}>All Reactions</h6>
                                </Col>
                            </Row>
                        </div>
                        <InView as="div" onChange={(inView, entry) => inView ? this.StanStart(inView) : this.setState({ stillStanned: false })}>
                            {this.state.post.firstreaction!==undefined?<Reaction obj={this.state.post.firstreaction} />:null}
                        </InView>
                    </Col>
                </Row>
                <Drawer
                    open={this.state.openall}
                    onRequestClose={() => this.setState({ openall: false })}
                    modalElementClass=""
                    style={{top:0}}
                    
                >
                    <div className=" text-left reactall"> 
                        <AllReactions postid={post._id} reactionNo={post.reactionNo}/>
                    </div>
                </Drawer>
            </div>
        )
    }
}

