import React, { useRef, useState } from 'react';
import './Post.css';
import { Row, Col, Avatar,Menu, Typography, Icon, Space, message, Divider, Dropdown, Button } from 'antd';
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

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const { Text, Title } = Typography;
const serverUrl = "http://localhost:3001/";


class Option extends  React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            obj: this.props.obj,
            loadingDel:false
        }
    
    }



    render()
    {
        return(
            <div style={{ borderRadius: "25px" }} className="shadow-4 bg-light  border-0 ">
                <div className="pt-2 text-center border-bottom pb-2">
                    <Text strong >Options</Text>
                </div>
                <div className="pt-3 pl-3 pr-3 pb-3" style={{ borderRadius: "25px",width:"15vw" }}>
                    <div className="p-2">
                        <Button className="w-100" shape="round" type="primary">Report</Button>
                    </div>
                    <div className="p-2">
                        <Button shape="round" loading={this.state.loadingDel} 
                        className="w-100" onClick={this.deleteReply} type="danger">Delete</Button>
                    </div>
                </div>
            </div>

        )
    }
}

export default Option;