import React, { useRef } from 'react';
import './Post.css';
import '../Utilities/utilities.css';
import { Row, Col, Avatar, Typography, Icon, message, Modal, Divider, Skeleton } from 'antd';
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
import Swiper from 'react-id-swiper';
import "swiper/css/swiper.css";
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Player, ControlBar, PlayToggle } from 'video-react';
import TrackVisibility from 'react-on-screen';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const { Text, Title } = Typography;
const serverUrl = "http://localhost:3001/";
const params = {
    autoHeight: true,
    spaceBetween: 0,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
};

let click = 0;

export default class Texty extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            animatelike: "",
            animatelove: "",
            loading: true,
            
            //audio
            rotate:"",
            play:"",
            
            post: this.props.obj,

            stat: 0,

            //stan
            stan: false,
            stantime: 2000,
            stanclass: "stan1",
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
            openall: false,
            initReactions: [],
            loadingReactions: false,

        }
    }

    componentDidMount() {
        if (this.props.obj.type === 1) {
            let stantime = ((this.props.obj.text.length) * 1000) / 30;
            this.setState({ stantime: stantime < 1000 ? 2000 : stantime, loading: true, loadingReactions: true })
        }
        else {
            this.setState({ stantime: 3000, loading: true, loadingReactions: true })
        }

        axios.get(`${serverUrl}data/getUserProfileInit?userid=${this.props.obj.userid}`).then((response) => {
            let temp = this.state.post;
            if (response.data) {
                temp.username = response.data.username;
                temp.fullname = response.data.fullname;
                temp.avatar = response.data.avatar;
                temp.verify = response.data.verify;
                this.setState({ post: temp })
            }

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
                    this.setState({ stan: response.data.stan }, () => {
                        if (response.data.stan) {
                            this.setState({ stan: true, stanclass: "stan2" })
                        }
                        this.setState({ loading: false })
                        if(this.props.type===1)
                        {
                            axios.get(`${serverUrl}feeds/getInitReaction?postid=${this.props.obj._id}`)
                                .then((response) => {
                                    this.setState({ initReactions: response.data, loadingReactions: false })
                                }).catch(e => {
                                    //message.warning("Unable to Fetch Reactions! Try again Later.", 2)
                                })
                        }
                        else{
                            this.setState({ loadingReactions: false })
                        }
                    })
                    if (response.data.save) {
                        this.setState({ saveState: FaBookmark, saveColor: "text-dark" })
                    }
                })
        })


    }

    tagColor = (text) => {
        let temp = text.split(" ");
        var result = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i][0] !== undefined && temp[i][0].trim() === '@' && temp[i].trim().length !== 1) {
                var a = temp[i];
                result.push(" ");
                result.push(<Link to={'/profile/' + a} key={i + "" + this.state.post._id}><span className="myblue pointer"  >{a}</span></Link>);
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
        this.setState({ stillStanned: true });
        if (!this.state.stan) {
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
                            this.setState({ stan: true, post: temp, stanclass: "stan2" })
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


    openreaction = (id) => {
        this.props.openreaction(id);
    }
    openCreate = (id) => {
        this.props.openreaction(id);
        this.setState({ openall: false })
    }
    updateReaction = () => {
        let ttt = this.state.post;
        ttt.reactionNo--;
        this.setState({ openall: false, firstreaction: undefined, post: ttt })
    }
    clickcount = (id) => {
        if (click === 0) {
            this.doubleLike(id)
            click++;
        }
        else {
            click++;
        }
    }
    doubleLike = (id) => {
        setTimeout(() => {
            if (click === 2) {
                if (id === 1) {
                    this.LikeorLove(1)
                }
                else if (id === 2) {
                    this.LikeorLove(2)
                }
            }
            click = 0;
        }, 500)
    }

    play=()=>{
        let vid=document.getElementById(this.state.post._id)
        if(vid!==null && localStorage.getItem("hmmmmmmm")===null)
        {
            vid.play();
            localStorage.setItem("hmmmmmmm",true)
        }
    }
    pause=()=>{
        let vid = document.getElementById(this.state.post._id)
        if(vid!==null)
        {
            vid.pause();
            localStorage.removeItem("hmmmmmmm")
        }
    }

    render() {

        const post = this.state.post;
        if (this.state.loading) {
            return (
                <div>
                    <div class="ph-item">

                        <div class="ph-col-2">
                            <div class="ph-avatar"></div>
                        </div>

                        <div>
                            <div class="ph-row">
                                <div class="ph-col-4"></div>
                                <div class="ph-col-8 empty"></div>
                                <div class="ph-col-6"></div>
                                <div class="ph-col-6 empty"></div>
                                <div class="ph-col-2"></div>
                                <div class="ph-col-10 empty"></div>
                            </div>
                        </div>

                        <div class="ph-col-12">
                            <div class="ph-picture"></div>
                            <div class="ph-row">
                                <div class="ph-col-10 big"></div>
                                <div class="ph-col-2 empty big"></div>
                                <div class="ph-col-4"></div>
                                <div class="ph-col-8 empty"></div>
                                <div class="ph-col-6"></div>
                                <div class="ph-col-6 empty"></div>
                                <div class="ph-col-12"></div>
                            </div>
                        </div>

                    </div>
                </div>
            )
        }
        return (
            <div className="postcard mb-5   pb-2 bg-white" >
                <Row justify="space-around" className="pl-3 pr-3 pb-2 pt-3" align="middle">
                    <Col span={12} className="text-left">
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
                                            <Text strong className="username myblue pointer">{post.username}</Text>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "-4px" }}>
                                    <Col flex="auto">
                                        <Text type="secondary" className="time">{timeAgo.format(Date.now() - (new Date().getTime() - new Date(post.time).getTime()))}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} className="float-right" >
                        <div className="mt-2">
                            <span>
                                <this.state.saveState onClick={this.save} className={this.state.saveColor + " pointer float-right saveicon"} />
                            </span>
                        </div>
                    </Col>
                </Row>
                <Row className='mt-1'>
                    {this.props.obj.type === 1 ?
                        <Col xs={24} className="text-left  pb-4 pr-2 " style={{ marginLeft: "33px", marginTop: "-15px" }}>
                            <div className="texty pl-3 " >
                                <Text>{this.tagColor(post.text)}</Text>
                            </div>
                        </Col>
                        : this.props.obj.type === 2 ?
                            <Col xs={24} className="text-left pl-3 pr-3  pt-2" style={{ marginTop: "-10px" }}>
                                {this.props.obj.photosLink.length === 1 ?
                                    <div className="text-center ">
                                        <div style={{ position: "relative", overflow: "hidden" }}>
                                            <div style={{ position: "absolute", height: "100vh", width: "100%" }}>
                                                <div onClick={() => this.clickcount(1)} style={{ height: "100vh", width: "50%" }} className="d-inline-block bg-transparent">
                                                </div>
                                                <div onClick={() => this.clickcount(2)} style={{ height: "100vh", width: "50%" }} className="d-inline-block bg-transparent float-right">
                                                </div>
                                            </div>
                                            <LazyLoadImage
                                                alt={this.props.obj.photosLink[0]}
                                                threshold={100}
                                                className="post"
                                                effect="blur"
                                                visibleByDefault={true}
                                                src={this.props.obj.photosLink[0]}
                                                width={"100%"} />
                                        </div>
                                    </div>
                                    : <Swiper {...params}>
                                        {this.props.obj.photosLink.map((link, index) => (
                                            <div className="text-center ">
                                                <div style={{ position: "relative", overflow: "hidden" }}>
                                                    <div style={{ position: "absolute", height: "100vh", width: "100%" }}>
                                                        <div onClick={() => this.clickcount(1)} style={{ height: "100vh", width: "50%" }} className="d-inline-block bg-transparent">
                                                        </div>
                                                        <div onClick={() => this.clickcount(2)} style={{ height: "100vh", width: "50%" }} className="d-inline-block bg-transparent float-right">
                                                        </div>
                                                    </div>
                                                    <LazyLoadImage
                                                        alt={link}
                                                        threshold={100}
                                                        className="post"
                                                        effect="blur"
                                                        visibleByDefault={true}
                                                        src={link}
                                                        width={"100%"} />
                                                </div>
                                            </div>
                                        ))}
                                    </Swiper>}
                            </Col>
                            : this.props.obj.type === 3 ?
                                <Col xs={24} className="text-center pl-3 pt-2  pr-3" style={{ marginTop: "-10px" }}>
                                    <InView threshold={1}>
                                        {({ inView, ref, entry }) => {
                                            //console.log(inView, post.text.slice(0, 10))
                                            if(inView)
                                            {
                                                this.play();
                                            }
                                            else{
                                                this.pause();
                                            }
                                            return <div ref={ref}>
                                                    <video id={post._id} autoPlay style={{width:"auto",maxHeight:"77vh", 
                                                    maxWidth: "100%", height: "auto" }}
                                                        src={post.videoLink} controls controlsList="nodownload" /> 
                                            </div>
                                            }}
                                    </InView>
                                </Col>
                                : this.props.obj.type === 4 ?
                                    <Col xs={24} className="text-center pl-3 pt-2  pr-3" style={{ marginTop: "-10px" }}>
                                        <InView threshold={0.9}>
                                            {({ inView, ref, entry }) => {
                                                //console.log(inView, post.text.slice(0, 10))
                                                return <div ref={ref}>
                                                    {inView ?
                                                        <div>
                                                            <Avatar className={"pointer m-3 shadow-2-l " + this.state.rotate} shape="circle" style={{
                                                                height: "30vh",
                                                                width: "30vh",
                                                                border: "10px solid white"
                                                            }} src={post.coverLink} />
                                                            <AudioPlayer
                                                                style={{
                                                                    width: "100%",
                                                                    outline: "none",
                                                                    border: "none",
                                                                }}
                                                                className="border-0 rr"
                                                                autoPlay={true}
                                                                onPlay={() => this.setState({ rotate: "rotate" })}
                                                                onPause={() => this.setState({ rotate: "" })}
                                                                src={post.audioLink}
                                                                preload={true}
                                                                showVolumeControl={false}
                                                                showJumpControls={false}
                                                                showDownloadProgress={false}
                                                                showLoopControl={false}
                                                            />
                                                        </div>

                                                        :
                                                        <div>
                                                            <Avatar className={"pointer m-3 shadow-2-l " + this.state.rotate} shape="circle" style={{
                                                                height: "30vh",
                                                                width: "30vh",
                                                                border: "10px solid white"
                                                            }} src={post.coverLink} />
                                                            <AudioPlayer
                                                                style={{
                                                                    width: "100%",
                                                                    outline: "none",
                                                                    border: "none",
                                                                }}
                                                                className="border-0 rr"
                                                                onPlay={() => this.setState({ rotate: "rotate" })}
                                                                onPause={() => this.setState({ rotate: "" })}
                                                                src={post.audioLink+"asd"}
                                                                preload={true}
                                                                showVolumeControl={false}
                                                                showJumpControls={false}
                                                                showDownloadProgress={false}
                                                                showLoopControl={false}
                                                            />
                                                        </div>
                                    }
                                                </div>
                                            }}
                                        </InView>
                                    </Col>
                                    : null}

                </Row>
                <Row type="flex" justify="space-around" className="pl-3  pr-3 pt-2 " align="middle">
                    <Col xs={8} className=" text-left " style={{ marginTop: "-3px" }}>
                        <div className=" "><b className=' stannum  myblue' >{post.streams}</b>
                            <span className={this.state.stanclass + " myblue"}> Stan</span></div>
                    </Col>
                    <Col xs={8} className="text-center text-break">
                        <Row type="flex" justify="center" align="middle" style={{ marginBottom: "-5px" }}>
                            <Col className="pr-2 ">
                                <div>
                                    {this.state.likeColor === "myblue" ?
                                        <this.state.likeState onClick={() => this.LikeorLove(1)} className={this.state.likeColor + "pointer myblue  animatelike likeicon "} />
                                        :
                                        <this.state.likeState onClick={() => this.LikeorLove(1)} className={this.state.likeColor + "pointer  myblue animatelike likeicon "} />
                                    }
                                </div>
                            </Col>
                            <Col className="pl-2 ">
                                <div>
                                    {this.state.loveColor === "myblue" ?
                                        <this.state.loveState onClick={() => this.LikeorLove(2)} className={this.state.loveColor + "pointer myblue  animatelove loveicon "} />
                                        :
                                        <this.state.loveState onClick={() => this.LikeorLove(2)} className={this.state.loveColor + "pointer myblue  animatelove loveicon "} />
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={8} className="text-right ">
                        <div>
                            <Avatar src={this.state.reactIcon} className="grow pointer  likeicon"
                                onClick={() => this.openreaction(post._id)} />
                        </div>
                    </Col>
                </Row>
                <Row className="pl-3 text-left  pr-3 mb-2 ">
                    <Col xs={24}>
                        <div style={{ fontSize: "90%" }}>
                            <Link className="userlink " to={'/profile/' + post.username}>{post.fullname}</Link>
                            <span className="p-1 pl-2 stat">&#8226;</span>
                            <span className="p-1 stat">{post.likes} like</span>
                            <span className="p-1 pb-1 stat">&#8226;</span>
                            <span className="p-1 stat">{post.loves} heart</span>
                        </div>
                        {post.type !== 1 ? <Row className="pb-3 ">
                            <Text style={{ fontSize: "100%", fontWeight: "400", paddingBottomL: "5px", whiteSpace: "pre-line" }} className="text-break text-black">
                                {this.tagColor(post.text)}
                            </Text>
                        </Row> : <Row className="pb-2"></Row>}
                        <div className="pt-2 pb-2 border-top">
                            <Row align="middle" style={{ fontSize: "100%" }}>
                                <Col span={12} className="text-left">
                                    <Text strong ><span className=''  >
                                        <span className="text-dark">{post.reactionNo}</span></span> Reaction</Text>
                                </Col>
                                <Col span={12} className="text-right">
                                    <Text strong className="myblue pointer" onClick={() => this.setState({ openall: true })}>All Reactions</Text>
                                </Col>
                            </Row>
                        </div>

                        <InView as="div" onChange={(inView, entry) => inView ? this.StanStart(inView) : this.setState({ stillStanned: false })}>
                            <Skeleton loading={this.state.loadingReactions} avatar active={true}>
                                {this.state.post.firstreaction !== undefined ? <div className="border mb-3 msgborder bg-white pr-3 ">
                                    <Reaction first={true} obj={this.state.post.firstreaction} />
                                </div> : this.state.initReactions.length === 0 ?
                                        <div>
                                            <Text strong onClick={() => this.props.CreateReaction(this.props.obj._id)} className="pointer myblue">Give a Reaction.</Text>
                                        </div> : null}
                                {this.state.initReactions.slice(0, 1).map((obj, i) => <div className="border mb-3 pr-3 msgborder bg-white">
                                    <Reaction first={true} obj={obj} />
                                </div>)}
                                {this.state.initReactions.length > 1 ? <h6 className="myblue text-center pointer" style={{ fontSize: "90%" }} onClick={() => this.setState({ openall: true })}>
                                    View more Reactions</h6> : null}

                            </Skeleton>
                        </InView>
                    </Col>
                </Row>
                <Drawer
                    open={this.state.openall}
                    onRequestClose={() => this.setState({ openall: false })}
                    modalElementClass=""
                    style={{ top: 0 }}

                >
                    <div className=" text-left ">
                        <AllReactions openCreate={this.openCreate} postid={post._id} updateReaction={this.updateReaction} reactionNo={post.reactionNo} />
                    </div>
                </Drawer>
                <Drawer
                    open={this.state.openlikes}
                    onRequestClose={() => this.setState({ openlikes: false })}
                    modalElementClass=""

                >
                    <h6>Show likes </h6>
                </Drawer>
                <Drawer
                    open={this.state.openlikes}
                    onRequestClose={() => this.setState({ openlikes: false })}
                    modalElementClass=""

                >
                    <h6>Show love </h6>
                </Drawer>
                <Drawer
                    open={this.state.openlikes}
                    onRequestClose={() => this.setState({ openlikes: false })}
                    modalElementClass=""

                >
                    <h6>Show stans </h6>
                </Drawer>
                <Drawer
                    open={this.state.openlikes}
                    onRequestClose={() => this.setState({ openlikes: false })}
                    modalElementClass=""

                >
                    <h6>Show options </h6>
                </Drawer>
            </div>
        )
    }
}

