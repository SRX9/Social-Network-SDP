import React from 'react';
import './Post.css';
import { Row, Col, Avatar, Typography, Icon, message, Spin, Divider, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FaBookmark, FaRegBookmark, FaRegStar, FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import 'antd/dist/antd.css';
import axios from 'axios';
import SRtext from '../Utilities/SRtext';
import posture from '../../reactioncover.png';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
const { Text, Title } = Typography;

//1 text
//2 photo
//3 video
//4 audio

class CreateReaction extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            caption:"",
            fileurl:null,
            fileobj:null,
            fileload:false,
            placeholder:true,
            posting:false,
            type:1,
            avatar: localStorage.getItem("ava") === undefined ? "http://localhost:3001/AF.png" : localStorage.getItem("ava")
        }
    }

    react=()=>{
        this.setState({posting:true});
        var bodyFormData = new FormData();
        if(this.state.type!==1)
        {
            bodyFormData.append('file',this.state.fileobj);
            bodyFormData.append('type', this.state.type);
        }
        else{
            bodyFormData.append('type', 1);
        }
        bodyFormData.append('msg',this.state.caption);
        bodyFormData.append('time',new Date());
        bodyFormData.append('username',localStorage.getItem('!@#$'));
        bodyFormData.append('avatar',this.state.avatar);
        bodyFormData.append('userid',localStorage.getItem('$#@!'));
        bodyFormData.append('postid',this.props.postid)
        axios.put('http://localhost:3001/feedstat/uploadReaction', bodyFormData)
            .then(res => {
                this.setState({ posting: false });
                if(res.data.stat)
                {   
                    this.setState({placeholder:true,caption:"",type:1})
                    this.setState({
                        caption: "",
                        fileurl: null,
                        fileobj: null,
                        fileload: false,
                        placeholder: true,
                        posting: false,
                        type:1
                    },()=>{
                            this.props.addReaction(res.data.obj);
                    });

                }
                else{
                    message.warning("Server Error! Try Again after sometime.", 3)
                }
            }).catch(e=>{
                this.setState({ posting: false });
                message.warning("Server Error! Try Again after sometime.",3)
            })
    }


    _handleAttachChange = async (e) => {
        e.preventDefault();
        
        if (e.target.files && e.target.files.length > 0 && e.target.files.length <= 1) {
            this.setState({ fileload: true,placeholder:true })
            let file = e.target.files[0];
            const reader = new FileReader();
            if (file['type'].split('/')[0]==="video")
            {
                let blobURL = URL.createObjectURL(file);
                var video = document.createElement("video");
                video.preload = "metadata";
                video.src = URL.createObjectURL(file);
                video.onloadedmetadata = async () => {
                    window.URL.revokeObjectURL(blobURL);
                    if (video.duration > 181) {
                        message.warning(
                            "Video Duration should be less than 3 Minutes!",
                            3
                        );
                        this.setState({ placeholder: true, fileload: false, })
                        return;
                    }
                    else{
                        this.setState({type:3})
                    }
                };
            }
            else if (file['type'].split('/')[0]==="audio")
            {
                if (file.size > 10485761)
                {
                    message.warning(
                        "Audio File Size should be less than 10MB!",
                        3
                    );
                    this.setState({ fileload: false, placeholder: true })
                    return;
                }
                else{
                    this.setState({type:4})
                }
            }
            else if (file['type'].split('/')[0]==="image")
            {
                this.setState({type:2})
            }
            else{
                this.setState({type:1})
            }
            reader.addEventListener("load", () =>
                this.setState({
                    fileurl:reader.result,
                    fileobj:file,
                    placeholder: false, fileload: false 
                })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
        else {
            message.warning('Attach Some Media', 2);
        }
    };


    getCaption=(text)=>{
        this.setState({caption:text});
    }

    render()
    {
        return(
            <div className="w-100" style={{marginTop:"-22px"}} >
                <div className="d-inline-block" style={{ marginBottom:"-50px",marginLeft:"-13px" }}>
                    <div className="d-inline-block p-1 pt-2 pl-3">
                        <Avatar src={this.state.avatar} size={"large"} />
                    </div>
                    <h6 strong className="d-inline-block pl-1 text-dark">{localStorage.getItem("!@#$")}</h6>
                </div>
                <div className="d-inline-block font-weight-bolder w-100  text-right">
                    {this.state.caption.length}/1000
                </div>
                <SRtext limit={1000} done={this.state.caption} rows={6} place={"Write here..."} getCaption={this.getCaption} />
                {this.state.placeholder?
                    this.state.fileload ?
                    <div className="p-3 pb-3 text-center" >
                            <Loader
                                type="Puff"
                                color="rgb(0, 177, 236)"
                                height={50}
                                width={50}
                            />
                            <h6 className="text-black-50">Loading Media...</h6>
                    </div>:
                    <div className="p-1 text-center  rr" >
                        <form>
                    <label for="file-inputq">
                      <img
                        className="pointer "
                        style={{height:"auto",width:"130%"}}
                        src={posture}
                      />
                    </label>
                    <input
                      name="img"
                      id="file-inputq"
                      className="fileInputq"
                      type="file"
                      accept=".mp3, .mp4, .jpg, .png, .jpeg, .mkv"
                      multiple={false}
                      style={{ display: "none" }}
                      onChange={e => this._handleAttachChange(e)}
                    />
                  </form>
                    </div>:
                    <div className="pb-1" >
                        <div className=" text-center" >
                            <form >
                                <label for="file-inputq">
                                    <h6 className="myblue pt-3 pointer">Change</h6>
                                </label>
                                <input
                                    name="img"
                                    id="file-inputq"
                                    
                                    className="fileInputq"
                                    type="file"
                                    accept=".mp3, .mp4, .jpg, .png, .jpeg, .mkv"
                                    multiple={false}
                                    style={{ display: "none" }}
                                    onChange={e => this._handleAttachChange(e)}
                                />
                            </form>
                        </div>
                        {this.state.type===2?
                        <div className="text-center" >
                            <img  src={this.state.fileurl} className="rr reactimage" />
                        </div>
                        :this.state.type==3?
                        <div className="text-center" >
                            <video  preload={true} className="w-100 rr" className="nolink"
                             autoPlay={true} disablePictureInPicture controls controlsList="nodownload">
                                <source src={this.state.fileurl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>    
                        </div>
                        :this.state.type===4?
                        <div className="text-center" >
                            <audio controls  className="w-100" controlsList="nodownload">
                                <source src={this.state.fileurl} type="audio/mpeg"/>
                                Your browser does not support the audio tag.
                            </audio>
                        </div>
                        :null}
                    </div>}
                <div className="text-center pb-3 pt-2" >
                    <Button type="primary" shape="round" loading={this.state.posting} onClick={this.react}>Go!</Button>
                </div>
            </div>
        )
    }


}
export default CreateReaction;