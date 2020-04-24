import React, { useRef, useState } from 'react';
import {Link,withRouter} from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { message, Row,Col,Modal } from 'antd';
import Texty from './Post/Texty';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import CreateReaction from './Post/CreateReaction';


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
            
            //create reaction 
            reactOpen:false,
            postid:"",

        }
    }


    componentDidMount()
    {
        this.loadPosts();
    }


    loadPosts=()=>{
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


    openreaction=(id)=>{
        this.setState({postid:id},()=>{
            this.setState({reactOpen:true})
        })
    }

    addReaction = (obj) => {
        let tempposts=this.state.postfeeds;
        let l=tempposts.length;
        console.log(obj,"Asdasd")
        for(let i=0;i<l;i++)
        {
            if(tempposts[i]._id===this.state.postid)
            {
                tempposts[i].firstreaction=obj;
                tempposts[i].reactionNo++;
                break;
            }
        }

        this.setState({postfeeds:tempposts, reactOpen: false });
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
                    
                    <Row justify="center"  className="text-center">
                        <Col xxl={4} xl={2} lg={0} md={0} sm={0} className="">
                        </Col>
                        <Col xxl={16} xl={20} lg={24} md={24} sm={24} className="">
                            <Row justify="center">
                                <Col xxl={6} xl={6} lg={6} md={4} sm={0} className="">
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={16} sm={24} className="pb-5  nich">
                                    <div
                                        style={{
                                            fontSize: "160%",
                                            fontWeight: "600",
                                        }}
                                        className="text-dark p-1 bg-white shadow-4 pronav fixed-top ayefan"
                                    >
                                        ayefan
                                    </div>

                                    <div className="mt-5 pt-1 ">
                                            {this.state.postfeeds.map((obj,i) => {
                                                return obj._id===undefined?null:<div key={i}>
                                                    <Texty obj={obj} CreateReaction={this.openreaction} openreaction={this.openreaction} />
                                                    </div>
                                            }
                                            )}
                                    </div>
                                </Col>
                                <Col xxl={6} xl={6} lg={6} md={4} sm={0} className="">
                                </Col>
                            </Row>
                        </Col>
                        <Col xxl={4} xl={2} lg={0} md={0} sm={0} className="">
                        </Col>
                    </Row>
                    <Modal
                        title="Give Reaction"
                        centered
                        footer={null}
                        visible={this.state.reactOpen}
                        onOk={() => this.setState({ reactOpen: false })}
                        onCancel={() => this.setState({ reactOpen: false })}
                    >
                        <CreateReaction postid={this.state.postid}  addReaction={this.addReaction} />
                    </Modal>
                </div>
            )
        }

    }
}

export default withRouter(Home);