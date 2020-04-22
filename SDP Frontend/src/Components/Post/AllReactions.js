import React, { useRef } from 'react';
import './Post.css';
import { Row, Col, Avatar, Typography, Icon, message,Button, Modal, Divider, Skeleton } from 'antd';
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
import { MdExpandMore } from "react-icons/md";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const { Text, Title } = Typography;
const serverUrl = "http://localhost:3001/";


class AllReactions extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            delid:null,
            openoptions:false,
            postid:this.props.postid,
            reactions:[],
            finish:false,
            loading:false,
            openCreate:false,
        }
    }

    componentDidMount()
    {
        axios.get(`${serverUrl}feeds/getInitReaction?postid=${this.props.postid}`)
            .then((response) => {
                if(response.data.length===this.props.reactionNo)
                {
                    this.setState({finish:true})
                }
                this.setState({reactions:response.data})  
            }).catch(e=>{
                message.warning("Unable to Fetch Reactions! Try again Later.",2)
            })
    }

    loadMore=()=>{
        this.setState({loading:true})
        let lastid=this.state.reactions.length;
        axios.get(`${serverUrl}feeds/getChunkReactions?postid=${this.props.postid}&resumeid=${lastid}`)
            .then((response) => {
               let t=this.state.reactions;
               for(let i=0;i<response.data.length;i++)
               {
                   t.push(response.data[i])
               }
               if(t.length===this.props.reactionNo)
               {
                   this.setState({finish:true})
               }
               this.setState({reactions:t,loading:false});
            }).catch(e => {
                this.setState({ loading: false })
                message.warning("Unable to Fetch Reactions! Try again Later.", 2)
            })
    }
    //options to deleter report etc..
    openoptions = (id) => {
        this.setState({ delid: id }, () => {
            this.setState({ openoptions: true })
        })
    }

    deleteReaction = () => {
        let ttt = this.state.reactions;
        this.setState({ loadingDel: true });
        axios.get(`${serverUrl}feedstat/delReaction?id=${this.state.delid}&postid=${this.state.postid}`)
            .then((response) => {
                if (response.data) {
                    let temp = [];
                    ttt.map(obj => {
                        if (obj._id !== this.state.delid) {
                            temp.push(obj)
                        }
                    })
                    this.props.updateReaction();
                    this.setState({reactions:temp})
                    message.success("Reaction Deleted Succesfully!!!", 4);
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

    
    render()
    {
        return(
            <Row  justify="center" className="text-center reactall">
            <Col  span={24}>
                    <div className="bg-white pt-4 br "  >
                        <Title level={4} className="p-2  pl-4 pt- text-left  myfont  p-1">Reactions
                        <span className="p-1 float-right">{this.props.reactionNo}</span></Title>
                        {this.props.reactionNo === 0 ?
                            <div className="p-4 text-center border-top bg-white rr">
                                <Title level={4}>No Reactions.</Title>
                                <Text strong className="myblue pointer grow" onClick={() => this.props.openCreate(this.state.postid)}>Given one now!</Text>
                            </div>
                            : <div style={{ height: "88.75vh", overflow: "scroll" }} className="mb-5 pb-5 pt-4 bg-light border-top">
                                {this.state.reactions.map((obj, i) => {
                                    return <div className="bg-white border rr temp1 pr-4 ml-4 mr-4 mb-4 ">
                                        <Reaction obj={obj} first={true} openCreate={this.state.openCreate} openoptions={this.openoptions} index={i} key={i} /></div>
                                })}
                                {this.state.finish ?
                                    <div className="text-center p-4 ">
                                        <Text strong>That's it for now!</Text>
                                        <div className="mt-2">
                                            <Text strong className="myblue  pointer grow" onClick={() => this.props.openCreate(this.state.postid)}>Give Reaction</Text>
                                        </div>
                                    </div> : <div className="text-center p-4">
                                        {this.state.loading ? <div className="text-center p-4">
                                            <Skeleton loading={true} avatar active></Skeleton>
                                        </div> :
                                            <div className="text-center p-2 pointer grow">
                                                <MdExpandMore onClick={this.loadMore} style={{ fontSize: "350%" }} />
                                            </div>}
                                    </div>}
                            </div>

                        }
                    </div>
            </Col>
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
                                    className="w-100" onClick={() => this.deleteReaction(this.state.delid)} type="danger">Delete</Button>
                            </div>
                        </div>
                    </div>
                </Drawer>
            </Row>
        )
    }
}

export default AllReactions;