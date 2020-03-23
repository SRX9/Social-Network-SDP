import React, { useRef,useState } from 'react';
import './Post.css';
import { Row, Col, Avatar, Typography, Icon, message, Divider } from 'antd';
import TimeAgo from 'javascript-time-ago'
import { Link } from 'react-router-dom';
import en from 'javascript-time-ago/locale/en'
import { FaBookmark, FaRegBookmark, FaRegStar, FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import 'antd/dist/antd.css';
import { InView, useInView } from 'react-intersection-observer';
import axios from 'axios';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const { Text, Title } = Typography;
const serverUrl = "http://localhost:3001/";

class Reaction extends React.Component
{
    
    constructor(props)
    {
        super(props);
        this.state={
            obj:this.props.obj
        }
    }
    tagColor = (text) => {
        let temp = text.split(" ");
        var result = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i][0] !== undefined && temp[i][0].trim() === '@' && temp[i].trim().length !== 1) {
                var a = temp[i];
                result.push(" ");
                result.push(<Link to={'/profile/' + a.slice(1,)}><span className="myblue pointer" >{a}</span></Link>);
            }
            else if (temp[i][0] !== undefined && temp[i][0].trim() === '#' && temp[i].trim().length !== 1) {
                var a1 = temp[i];
                result.push(" ");
                result.push(<Link to={'/tag/' + a1.slice(1,)}><span className="myblue pointer">{a1}</span></Link>);
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

    render()
    {   const obj=this.state.obj;
        if(obj.type===1)
        {
            return(
                <div className="mb-3 ">
                    <Row justify="space-around" className="p-1" align="middle">
                        <Col span={12} className="text-left p-2">
                            <Row type="flex">
                                <Col flex="auto" >
                                    <Avatar className="d-inline-block" src={obj.avatar} size={"large"} />
                                </Col>
                                <Col flex="auto" className="pl-1">
                                    <Row type="flex" style={{ marginBottom: "-5px" }}>
                                        <Col flex="auto">
                                            <Text strong className="username text-dark">{obj.username}</Text>
                                        </Col>
                                        <Col flex="auto">
                                            <span className="pl-1 username mt-2 ">&#8226;</span>
                                        </Col>
                                        <Col flex="auto">
                                            <span className="pl-1 myblue username mt-2 pointer">reply</span>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "-5px" }}>
                                        <Col flex="auto">
                                            <Text type="secondary" className="time">{timeAgo.format(Date.now() - (new Date().getTime() - new Date(obj.time).getTime()))}</Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12} className="float-right p-2" >
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} className="reacttext">
                            <Text strong className="text-black">
                                {this.tagColor(obj.text)}
                            </Text>
                        </Col>
                    </Row>
                </div>
            )
        }
        else if(obj.type===2)
        {
            return (
                <div className="mb-3 text-left  ">
                    <Row justify="space-around" className="p-1" align="middle">
                        <Col span={12} className="text-left p-2">
                            <Row type="flex">
                                <Col flex="auto" >
                                    <Avatar className="d-inline-block" src={obj.avatar} size={"large"} />
                                </Col>
                                <Col flex="auto" className="pl-1">
                                    <Row type="flex" style={{ marginBottom: "-5px" }}>
                                        <Col flex="auto">
                                            <Text strong className="username text-dark">{obj.username}</Text>
                                        </Col>
                                        <Col flex="auto">
                                            <span className="pl-1 username mt-2 ">&#8226;</span>
                                        </Col>
                                        <Col flex="auto">
                                            <span className="pl-1 username   myblue mt-2 pointer">reply</span>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "-5px" }}>
                                        <Col flex="auto">
                                            <Text type="secondary" className="time">{timeAgo.format(Date.now() - (new Date().getTime() - new Date(obj.time).getTime()))}</Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12} className="float-right p-2" >
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} className="reacttext">
                            <div>
                                <Text strong className="text-black">
                                    {this.tagColor(obj.text)}
                                </Text>
                            </div>

                            <div className="reactimagecenter">
                                <img src={obj.image} className="img-fluid reactimage" />
                            </div>
                        </Col>
                    </Row>
                </div>
            )
        }
    }
}  


export default Reaction;