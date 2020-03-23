import React, { useRef, useState } from 'react';
import {Link,withRouter} from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { message, Row,Col } from 'antd';
import Texty from './Post/Texty';
import PhotoPost from './Post/ImagePost';
import VideoPost from './Post/VideoPost';
import AudioPost from './Post/AudioPost';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';

const params = {
    slidesPerView: 1,
    spaceBetween: 10,
    centered:true,
    keyboard:true,
    pagination: {
        type: 'fraction',
        clickable: true
    },

}
//1 text
//2 photo
//3 video
//4 audio
const serverUrl = "http://localhost:3001/";
class Home extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            userObj:this.props.userobj,
            loading:false,
            postfeeds:[],
            swiper:null
        }
    }

    componentDidMount()
    {
        this.loadPosts();
    }

    loadPosts=()=>{
        console.log("Hello", this.state.userObj, localStorage.getItem("!@#$"))
        axios.get(`${serverUrl}feeds/userfeeds?userid=${localStorage.getItem('$#@!')}`).then((res) => {
            let ids = res.data.postsid.reverse();
            for (let i = 0; i < ids.length; i++) {
                axios.get(`${serverUrl}feeds/getpostdetails?postid=${ids[i]}`).then(res => {
                    let temp = this.state.postfeeds;
                    temp.push(res.data);
                    this.setState({ postfeeds: temp });
                })
            }
        })
    }

    updateSwiper=(swiper)=>{
        this.setState({swiper});
    }


    render()
    {
        
        if(this.state.postfeeds.length===0)
        {
            return <div/>
        }
        else{
            return (
                <div className="w-100 text-center bg-light home overflow-scroll      pb-5" >
                    <div
                        style={{
                            fontSize: "180%",
                            fontWeight: "600",
                        }}
                        className="text-dark shadow-4 name overflow-hidden text-break fixed-top ayefan"
                    >
                        ayefan
                    </div>
                    <Row justify="center"  className="text-center mt-5">
                        <Col xxl={4} xl={2} lg={0} md={0} sm={0} className="">
                        </Col>
                        <Col xxl={16} xl={20} lg={24} md={24} sm={24} className="">
                            <Row justify="center">
                                <Col span={6} className="">
                                </Col>
                                <Col span={12} className="pb-5  nich">
                                    <Swiper {...params} getSwiper={this.updateSwiper}>
                                        {this.state.postfeeds.map(obj => {
                                            if (obj.type === 1) {
                                                return <div>
                                                    <Texty obj={obj} />
                                                    </div>
                                            }
                                            else if (obj.type === 2) {
                                                return <div>
                                                    <PhotoPost obj={obj} />
                                                    </div>
                                            }
                                            else if (obj.type === 3) {
                                                return <div><VideoPost obj={obj} />
                                                    </div>
                                            }
                                            else if (obj.type === 4) {
                                                return <div><AudioPost obj={obj} />
                                                    </div>
                                            }
                                        })}
                                    </Swiper>
                                </Col>
                                <Col span={6} className="">
                                </Col>
                            </Row>
                        </Col>
                        <Col xxl={4} xl={2} lg={0} md={0} sm={0} className="">
                        </Col>
                    </Row>
                </div>
            )
        }

    }
}

export default withRouter(Home);