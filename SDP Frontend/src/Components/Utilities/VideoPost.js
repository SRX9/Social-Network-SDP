import React from "react";
import { Row, Col, Modal, Button, Radio, Icon, Typography, message, Progress } from "antd";
import "./utilities.css";
import { MdCrop } from "react-icons/md";
import axios from "axios";
import SRtext from "./SRtext";
import uniqid from "uniqid";
import VideoPlayer from "../Videoplayer/VideoPlayer";
const { Text, Title } = Typography;

const posture = require("../video.png");

class VideoPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percent:0,
      uploaded:true,
      small:true,
      videoload: false,
      videoUrl: null,
      videoObj: null,
      loading: false,
      caption: "",
      placeholder: true,
      visible: 1,
      player:1,
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
    this.setState({percent:0,uploaded:false})
    const config = {
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        this.setState({percent:percentCompleted},()=>{
          if(percentCompleted===100)
          {
            this.setState({uploaded:true})
          }
        });
      }
    }

    if (this.state.placeholder && this.state.videoUrl === null && this.state.videoObj===null) {
      message.warning("Select a Video to Post!", 1);
      return;
    }
    const obj = this.props.userobj;
    this.setState({ loading: true });
    var bodyFormData = new FormData();
    var vid = this.state.videoObj;
    bodyFormData.append("vid", vid);
    bodyFormData.append("userid", localStorage.getItem("$#@!"));
    bodyFormData.append("username", obj.username);
    bodyFormData.append("fullname", obj.fullname);
    bodyFormData.append("avatar", obj.avatar);
    bodyFormData.append("time", new Date());
    bodyFormData.append("text", this.state.caption);
    bodyFormData.append("playerType", this.state.player);
    bodyFormData.append("visible", this.state.visible);
    bodyFormData.append("reactionStat", this.state.reactionStat);
    axios
      .put("http://localhost:3001/createpost/uploadVideoPost", bodyFormData, config)
      .then(res => {
        if (res.data.stat) {
          this.setState({ loading: false });
          this.setState({ placeholder: true,caption:"" }, () => {
            setTimeout(() => { this.setState({ videoUrl: "", videoObj: "" }) }, 1000)
          });
        } else {
          message.error("Server Down! Please Try After Sometime.", 2);
          this.setState({ loading: false });
        }
        console.log(res);
      })
      .catch(err => {
        this.setState({ loading: false })
        message.warning("Server error!", 4);
        console.log(err)});
  };

  setRunTime=async(file)=>{

    let blobURL = URL.createObjectURL(file);
    var video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(blobURL);
      if (video.duration < 211) {
        this.setState({ player: 2 });
      }
    }
  }

  _handleVideoChange = async e => { 
    if (!this.state.placeholder ||this.state.videoObj!==null || this.state.videoUrl!==null)
    {
      this.setState({ placeholder: true, videoload: true},()=>{
        this.setState({ videoObj: null, videoUrl: null })
      })
    }
    if (
      e.target.files &&
      e.target.files.length > 0 &&
      e.target.files.length < 2
    ) {
      this.setState({ videoload: true });
      const reader = new FileReader();
      let file = e.target.files[0];
      this.setRunTime(file);
      if (file.size > 1181116008)
      {
        message.warning("Maximum Video Size Should be less than 1.1Gb!",4);
        this.setState({ placeholder: true, videoload: false })
        return;
      }
      else{
        if (file.size > 209715201) {
          reader.addEventListener("load", () =>
            this.setState({ small: false, videoObj: file, placeholder: false, videoload: false })
          );
        }
        else {
          reader.addEventListener("load", () =>{
            this.setState({small:true, videoUrl: reader.result, videoObj: file, placeholder: false, videoload: false })
          })
        }
      }
      reader.readAsDataURL(e.target.files[0]);
    } else {
      message.warning("Maximum 1 Video Allowed!", 2);
    }
    
  };

  getCaption = val => {
    this.setState({ caption: val });
  };

  render() {
    return (
      <div className="bg-light">
        <Row type="flex" justify="center">
          <Col
            span={13}
            className="bg-white bor border m-2"
            style={{ Height: "30vh" }}
          >
            {this.state.placeholder ? (
              !this.state.videoload ? (
                <div className="p-4 tc  ">
                  <form>
                    <label for="file-input3">
                      <img
                        className="pointer"
                        src={posture}
                        style={{
                          height: "auto",
                          width: "100%"
                        }}
                      />
                    </label>
                    <input
                      name="img"
                      id="file-input3"
                      className="fileInput3"
                      type="file"
                      style={{ display: "none" }}
                      accept=".mp4"
                      multiple={false}
                      onChange={e => this._handleVideoChange(e)}
                    />
                  </form>
                </div>
              ) : (
                <div className="p-4 tc  ">
                  <h1>Loading</h1>
                </div>
              )
            ) : (
              <div className="p-2">
                <span className="d-inline-block ">
                  <div
                    onClick={() => {
                      this.setState({ placeholder: true }, () => {
                        setTimeout(() => { this.setState({ videoUrl: "", videoObj: "" })},1000)
                      });
                    }}
                    className="p-1 m-1 pl-2 pr-2 bor dim shadow-1  shadow pointer "
                  >
                    <Icon type="delete" />
                  </div>
                </span>
                <span className="d-inline-block ">
                  <form>
                    <label for={`file-input3`}>
                      <div className="p-1 m-1 pl-2 pr-2 bor dim shadow-1  shadow pointer ">
                        <Icon type="reload" />
                      </div>
                    </label>
                    <input
                      id={`file-input3`}
                      className={`file-input3`}
                      type="file"
                      name="vid"
                      accept=".mp4"
                      multiple={false}
                      style={{ display: "none" }}
                      onChange={e => this._handleVideoChange(e)}
                    />
                  </form>
                </span>
                <div className="text-center pb-3">
                    {this.state.small ? <VideoPlayer
                      className="p-2 text-center"
                      video={this.state.videoUrl}
                      play={this.props.stop}
                      style={{
                        width: "auto",
                        maxHeight: "30vw",
                        height: "auto"
                      }}
                    />:<div className="pt-4 p-5">
                      <h5 strong className="text-dark">{this.state.videoObj.name}</h5>
                      <h6 className="text-success pt-3"><span className="font-weight-bold">&#10003;</span>	 Selected</h6>
                      <Text className="myblue">Note:</Text> <Text className="text-black-50">As Video size is big, Browser not able to show preview.</Text>
                    </div>}
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
            <SRtext rows={8} done={this.state.caption} getCaption={this.getCaption} />
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
                onChange={e => this.setState({ reactionStat: e.target.value })}
                buttonStyle="solid"
              >
                <Radio.Button value="1">Enabled</Radio.Button>
                <Radio.Button value="2">Disabled</Radio.Button>
              </Radio.Group>
            </div>
            <div className="pt-4 text-left">
              {this.state.uploaded?
                <Button
                  loading={this.state.loading}
                  onClick={this.upload}
                  size="large"
                  className="w-100"
                  type="primary"
                >
                  Post
              </Button>
              :
              <div className="text-center">
                  <h6 className="text-center">Posting...</h6>
                  <Progress percent={this.state.percent} status="active" />
                </div>

              }
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default VideoPost;
