import React, { useRef } from 'react';
import './Post.css';
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
            postid:this.props.postid,
            reactions:[],
            finish:false,
            loading:false
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
        let lastid=this.state.reactions[this.state.reactions.length-1]._id;
        axios.get(`${serverUrl}feeds/getChunkReactions?postid=${this.props.postid}&resumeid=${lastid}`)
            .then((response) => {
               let t=this.state.reactions;
               for(let i=1;i<response.data.length;i++)
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

    render()
    {
        return(
            <div className="bg-white br"  >
                <Title  level={4}  className="p-2  pl-4 pt-3  myfont  p-1">Reactions 
                <span  className="p-1 float-right">{this.props.reactionNo}</span></Title>
                {this.props.reactionNo===0?
                <div className="p-4 text-center border-top bg-white rr">
                    <Title level={4}>No Reactions.</Title>
                    <Text strong>Given one now!</Text>
                </div>
                :<div  style={{ height: "88.75vh", overflow: "scroll" }} className="mb-5 pb-5 pt-4 bg-light border-top">
                    {this.state.reactions.map((obj, i) => {
                        return <div className="bg-white border rr temp1 pr-4 ml-4 mr-4 mb-4 "><Reaction obj={obj} key={i}/></div>
                    })}
                    {this.state.finish?
                    <div className="text-center p-4 ">
                        <Text strong>That's it for now!</Text>
                    </div> : <div className="text-center p-4">
                        {this.state.loading?<div  className="text-center p-4">
                           <Skeleton loading={true} avatar active></Skeleton>
                        </div>:
                        <div className="text-center p-2 pointer grow">
                            <MdExpandMore onClick={this.loadMore} style={{fontSize:"350%"}}/>
                        </div>}    
                    </div>}
                </div>
        
                }
                </div>
        )
    }
}

export default AllReactions;