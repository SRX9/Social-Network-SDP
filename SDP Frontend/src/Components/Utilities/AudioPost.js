import React from "react";
import { Row, Col, Modal,Avatar, Button, Radio, Icon, message } from "antd";
import "./utilities.css";
import { MdCrop } from "react-icons/md";
import axios from "axios";
import SRtext from "./SRtext";
import uniqid from "uniqid";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const posture = require("../audio.png");
const cover =require("../audio_cover.png");

class AudioPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rotate:"",

            play:true,
            audioload: false,
            audioUrl: null,
            audioObj: null,

            coverload: false,
            coverload1:false,
            coverUrl: null,
            coverObj: null,

            loading: false,
            caption: "",
            
            placeholder1: true,
            placeholder2: true,

            visible: 1,
            reactionStat: 1,
            crop: {
                unit: "%",
                x: 130,
                y: 50,
                width: 200,
                height: 200
            }
        };
    }

    upload = () => {
        if (this.state.placeholder1 ) {
            message.warning("Select a Audio to Post!", 2);
            return;
        }
        else if (this.state.placeholder2){
          message.warning("Select a Audio Cover to Post!", 2);
          return;
        }
        else{
          const obj = this.props.userobj;
          this.setState({ loading: true });
          var bodyFormData = new FormData();
          var aud = this.state.audioObj;
          var cover = this.state.coverObj;
          bodyFormData.append("aud", aud);
          bodyFormData.append("aud", cover);
          bodyFormData.append("userid", obj._id);
          bodyFormData.append("username", obj.username);
          bodyFormData.append("fullname", obj.fullname);
          bodyFormData.append("avatar", obj.avatar);
          bodyFormData.append("time", new Date());
          bodyFormData.append("text", this.state.caption);
          bodyFormData.append("visible", this.state.visible);
          bodyFormData.append("reactionStat", this.state.reactionStat == 1 ? true : false);
          axios
            .put("http://localhost:3001/createpost/uploadAudioPost", bodyFormData)
            .then(res => {
              if (res.data.stat) {
                this.setState({ loading: false,caption:"" },()=>{this.setState({placeholder1:true,placeholder2:true})});
              } else {
                message.error("Server Down! Please Try After Sometime.", 2);
                this.setState({ loading: false });
              }
              console.log(res);
            })
            .catch(err =>{ 
              this.setState({ loading: false });
              message.warning("Server error!", 4);
              console.log(err)});
        }

    };

    _handleAudioChange = async e => {
        if (
            e.target.files &&
            e.target.files.length > 0 ) {
            this.setState({ coverload: true });
            const reader = new FileReader();
            let file = e.target.files[0];
            if (file.size > 20971520) {
                message.warning("Audio Size Should be less than 20MB!", 4);
                this.setState({ coverload: false });
                return;
            }
             reader.addEventListener("load",() =>
                 this.setState({ audioUrl: reader.result, audioObj: file }, () => {
                        this.setState({ placeholder1: false, coverload: false });
                })
            );
          await reader.readAsDataURL(e.target.files[0]);
            }
        else {
            message.warning("Max 1 Video Allowed!", 2);
        }

    };


    _handleCoverChange=async e =>{
        this.setState({coverload1:true});
      const reader = new FileReader();
      let file = e.target.files[0];
      if (file.size > 52428800) {
        message.warning('Size of Audio Cover Photo should be less than 50MB', 2);
        return;
      }
        if (e.target.files && e.target.files.length > 0) {
                const reader = new FileReader();
                reader.addEventListener("load", () =>
                    this.setState({coverUrl:reader.result,coverObj:file},()=>this.setState({placeholder2:false,coverload1:false}))
                );
                reader.readAsDataURL(e.target.files[0]);
            }
        else {
            message.warning('Select Audio Cover Photo!', 2);
        }
    }


    getCaption = val => {
        this.setState({ caption: val });
    };

    render() {
        return (
          <div>
            <Row type="flex" justify="center">
              <Col
                span={13}
                className="bg-white p-3 bor border m-2"
                style={{ Height: "30vh" }}
              >
                <div >
                  {this.state.placeholder2 ?this.state.coverload1?<div>Loading</div>:(
                    <div className="ml-4 mr-4 mt-3">
                      <form>
                        <label for="file-input41">
                          <Avatar className="pointer shadow-2 border" shape="circle" src={cover} style={{
                            height: "30vh",
                            width: "30vh"
                          }} />

                        </label>
                        <input
                          name="img"
                          id="file-input41"
                          className="fileInput41"
                          type="file"
                          style={{ display: "none" }}
                          accept=".jpg, .jpeg, .png"
                          multiple={false}
                          onChange={e => this._handleCoverChange(e)}
                        />
                      </form>
                    </div>
                  ) : (
                      <div className="text-center">
                        <div
                          onClick={() => {
                            this.setState({ coverUrl: "", coverObj: "" }, () => {
                              setTimeout(() => {
                                this.setState({ placeholder2: true });
                              }, 100);
                            });
                          }}
                          style={{width:"40px"}}
                          className="p-1 m-1 pl-2 pr-2  bor dim shadow-1  shadow pointer "
                        >
                          <Icon type="delete" />
                        </div>
                        <Avatar className={"pointer m-3 shadow-2-l " +this.state.rotate} shape="circle"  style={{
                          height: "30vh",
                          width: "30vh",
                          border:"10px solid white"
                        }} src={this.state.coverUrl} />
                      </div>
                    )}
                </div>
                {this.state.placeholder1 ? (
                  !this.state.coverload ? (
                    <div className=" tc  m-3 ">
                      <form>
                        <label for="file-input31">
                          <img
                            className="pointer bor border"
                            src={posture}
                            style={{
                              height: "15vh",
                              width: "auto"
                            }}
                          />
                        </label>
                        <input
                          name="img"
                          id="file-input31"
                          className="fileInput31"
                          type="file"
                          style={{ display: "none" }}
                          accept=".mp3 ,.wav"
                          multiple={false}
                          onChange={e => this._handleAudioChange(e)}
                        />
                      </form>
                    </div>
                  ) : (
                    <div className="p-4 tc  ">
                      <h1>Loading</h1>
                    </div>
                  )
                ) : (
                  <div>
                    <div className="p-2">
                      <span className="d-inline-block ">
                        <div
                          onClick={() => {
                              this.setState({ audioUrl: "", audioObj: "" }, () => {
                              setTimeout(() => {
                                this.setState({ placeholder1: true});
                              }, 100);
                            });
                          }}
                          className="p-1 m-1 pl-2 pr-2 bor dim shadow-1  shadow pointer "
                        >
                          <Icon type="delete" />
                        </div>
                      </span>
                      <div className="text-center pb-3">
                        <AudioPlayer
                          style={{
                            width: "100%",
                            outline:"none"
                          }}
                          className="border-0 shadow-5"
                          autoPlay={this.state.play}
                          onPlay={()=>this.setState({rotate:"rotate"})}
                          onPause={()=>this.setState({rotate:""})}
                          src={this.state.audioUrl}
                          preload={true}
                          showVolumeControl={false}
                          showJumpControls={false}
                          showDownloadProgress={false}
                          showLoopControl={false}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Col>
              <Col
                span={7}
                className="bg-white text-left p-3 bor border m-2"
                style={{ Height: "300px" }}
              >
                <h6 className="text-muted">Description</h6>
                <SRtext done={this.state.caption} rows={8} getCaption={this.getCaption} />
                <div className="pt-3 text-left">
                  <h6 className="text-muted">Visible To</h6>
                  <Radio.Group
                    defaultValue="1"
                    onChange={e => this.setState({ visible: e.target.value })}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="1">All</Radio.Button>
                    <Radio.Button value="2">Fans</Radio.Button>
                    <Radio.Button value="3">Registered</Radio.Button>
                    <Radio.Button value="4">Private</Radio.Button>
                  </Radio.Group>
                </div>
                <div className="pt-3 text-left">
                  <h6 className="text-muted">Reactions</h6>
                  <Radio.Group
                    defaultValue="1"
                    onChange={e =>
                      this.setState({ reactionStat: e.target.value })
                    }
                    buttonStyle="solid"
                  >
                    <Radio.Button value="1">Enabled</Radio.Button>
                    <Radio.Button value="2">Disabled</Radio.Button>
                  </Radio.Group>
                </div>
                <div className="pt-4 text-left">
                  <Button
                    loading={this.state.loading}
                    onClick={this.upload}
                    size="large"
                    className="w-100"
                    type="primary"
                    
                  >
                    Post
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        );
    }
}

export default AudioPost;
