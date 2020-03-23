import React, { useRef } from 'react';
import './Post.css';
import { Row, Col, Avatar, Typography, Icon, message, Divider } from 'antd';
import TimeAgo from 'javascript-time-ago'
import { Link } from 'react-router-dom';
import en from 'javascript-time-ago/locale/en'
import { FaBookmark, FaRegBookmark, FaRegStar, FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import 'antd/dist/antd.css';
import { InView, useInView } from 'react-intersection-observer';
import axios from 'axios';
import Reaction from './Reaction';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const { Text, Title } = Typography;
const serverUrl = "http://localhost:3001/";


export default class Texty extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post: this.props.obj,
            stat: 0,
            stan: false,

            //stan
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
            reactionList:[
                {
                    avatar:"https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/taylor-swift-mtv-awards-1567449508.jpg?crop=0.665xw:1.00xh;0.206xw,0&resize=480:*",
                    username:"taylorswift",
                    verify:true,
                    text:"that like one of the finest and oldest @srx and &bts. #happiness.like one of the finest and oldes",
                    likes:0,
                    type:1,
                    time:new Date()
                },
                {
                    avatar: "https://pmcvariety.files.wordpress.com/2020/01/taylor-swift-variety-cover-5-16x9-1000.jpg?w=1000",
                    username: "taylornation",
                    verify: true,
                    text: "that like one of the finest and oldest @srx and &bts. #happiness.",
                    likes: 0,
                    image:"https://s.yimg.com/uu/api/res/1.2/qFD__NmMEWRfVTA6EXmW4Q--~B/aD0zMDcyO3c9MjA0ODtzbT0xO2FwcGlkPXl0YWNoeW9u/https://media.zenfs.com/en-US/pop_sugar_uk_fashion_37/836f234d1d1310f2c72cf5663ab87643",
                    type: 2,
                    time: new Date()

                },
                {
                    avatar: "https://www.rollingstone.com/wp-content/uploads/2019/08/taylor-swift-ultimate-album-sheff.jpg?resize=1800,1200&w=1800",
                    username: "taylornation",
                    verify: true,
                    text: "that like and &bts. #happiness.",
                    likes: 0,
                    image: "https://www.marketplace.org/wp-content/uploads/2019/04/GettyImages-1048415872.jpg?w=600",
                    type: 2,
                    time: new Date()

                },
            ]

        }
    }

    componentDidMount() {
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
                this.setState({ stan: response.data.stan })
            })
    }

    tagColor = (text) => {
        let temp = text.split(" ");
        var result = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i][0] !== undefined && temp[i][0].trim() === '@' && temp[i].trim().length !== 1) {
                var a = temp[i];
                result.push(" ");
                result.push(<Link to={'/profile/' + a}><span className="myblue pointer"  >{a}</span></Link>);
            }
            else if (temp[i][0] !== undefined && temp[i][0].trim() === '#' && temp[i].trim().length !== 1) {
                var a1 = temp[i];
                result.push(" ");
                result.push(<Link to={'/tag/' + a1}><span className="myblue pointer">{a1}</span></Link>);
            }
            else if (temp[i][0] !== undefined && temp[i][0].trim() === '&' && temp[i].trim().length !== 1) {
                var a2 = temp[i];
                result.push(" ");
                result.push(<Link to={'/group/' + a2}><span className="myblue pointer">{a2}</span></Link>);
            }
            else {
                result.push(" ");
                result.push(<span style={{ color: 'black' }}>{temp[i]}</span>);
            }
        }
        return result;
    }

    StanStart = () => {
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
                }).catch(e => {
                    message.warning('Server Down!! Please Try again Later');
                });
            }
        }, 3500)
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
    render() {

        const post = this.state.post;
        return (
            <InView as="div" onChange={(inView, entry) => inView ? this.StanStart() : this.setState({ stillStanned: false })}>
                <div className="postcard mb-3 pb-2 bg-white" >
                    <Row justify="space-around" className="p-1" align="middle">
                        <Col span={12} className="text-left p-2">
                            <Row type="flex">
                                <Col flex="auto" >
                                    <Avatar className="d-inline-block" src={post.avatar} size={"large"} />
                                </Col>
                                <Col flex="auto" className="pl-1">
                                    <Row type="flex" style={{ marginBottom: "-5px" }}>
                                        <Col flex="auto">
                                            <Text strong className="username text-dark">{post.username}</Text>
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
                    <Row type="flex" justify="space-around" className="p-1 pt-3 " align="middle">
                        <Col xs={8} className=" text-left pl-3 text-break">
                            <Text className="stannum font-weight-bolder">
                                {post.streams}
                            </Text>
                            <Text className="text-dark font-weight-bolder stans space" strong> Stans</Text>
                        </Col>
                        <Col xs={8} className="text-center text-break">
                            <Row type="flex" justify="center" align="middle" style={{ marginBottom: "-7px" }}>
                                <Col className="pr-2 pb-2">
                                    <div>
                                        <span className="ll">{post.likes}</span> <this.state.likeState onClick={() => this.LikeorLove(1)} className={this.state.likeColor + " grow icon likeicon"} />
                                    </div>
                                </Col>
                                <Col className="pl-2 pb-2">
                                    <div>
                                        <this.state.loveState onClick={() => this.LikeorLove(2)} className={this.state.loveColor + " grow icon loveicon"} /> <span className="ll">{post.loves}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={8} className="text-right pr-1 pb-1">
                            <div>
                                <Avatar src={this.state.reactIcon} className="grow  likeicon" />
                            </div>
                        </Col>
                    </Row>
                    <Row className="ml-3 text-left pt-2 mr-3 mb-2 border-top">
                        <Col xs={24}>
                            <div>
                                <Link className="userlink myblue" to={'/profile/' + post.username}>{post.fullname}</Link>
                                <span className="p-1 pl-2 stat">&#8226;</span>
                                <span className="p-1 stat">{post.likes} like</span>
                                <span className="p-1 pb-1 stat">&#8226;</span>
                                <span className="p-1 stat">{post.loves} heart</span>
                            </div>
                            <h6 className="pt-2 mb-2 reaction"><span className='text-black font-weight-bold'>{post.reactionNo}</span> Reactions</h6>
                            {this.state.reactionList.map(obj=>
                                    <Reaction obj={obj}/>
                            )}
                        </Col>
                    </Row>
                </div>
            </InView>
        )
    }
}

