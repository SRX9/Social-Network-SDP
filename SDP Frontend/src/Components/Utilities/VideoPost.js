import React from "react";
import { Row, Col, Modal, Button, Radio, Icon, message } from "antd";
import "./utilities.css";
import { MdCrop } from "react-icons/md";
import axios from "axios";
import SRtext from "./SRtext";
import uniqid from "uniqid";
import VideoPlayer from "../Videoplayer/VideoPlayer";

const posture = require("../video.png");

class VideoPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    if (this.state.placeholder && this.state.videoUrl === null && this.state.videoObj===null) {
      message.warning("Select a Video to Post!", 1);
      return;
    }
    const obj = this.props.userobj;
    this.setState({ loading: true });
    var bodyFormData = new FormData();
    var vid = this.state.videoObj;
    bodyFormData.append("vid", vid);
    bodyFormData.append("userid", obj._id);
    bodyFormData.append("username", obj.username);
    bodyFormData.append("fullname", obj.fullname);
    bodyFormData.append("avatar", obj.avatar);
    bodyFormData.append("time", new Date());
    bodyFormData.append("text", this.state.caption);
    bodyFormData.append("playerType", this.state.player);
    bodyFormData.append("visible", this.state.visible);
    bodyFormData.append("reactionStat", this.state.reactionStat);
    axios
      .put("http://localhost:3001/createpost/uploadVideoPost", bodyFormData)
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

  _handleVideoChange = async e => { 
    if (!this.state.placeholder ||this.state.videoObj!==null || this.state.videoUrl!==null)
    {
      this.setState({placeholder:true},()=>{
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
      if (file.size > 157286400) {
        message.warning("Video Size Should be less than 150MB!", 4);
        this.setState({ videoload: false });
        return;
      }
      let blobURL = URL.createObjectURL(file);
      var video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = async () => {
        window.URL.revokeObjectURL(blobURL);
        if(video.duration<211)
        {
          this.setState({player:2});
        }
        if (video.duration > 1801) {
          message.warning(
            "Video Duration should be less than 30 Minutes!",
            3
          );
          this.setState({ videoload: false });
          return;
        }
        else{
         reader.addEventListener("load",async () =>
           this.setState({ videoUrl: reader.result, videoObj: file }, () => {
              setTimeout(() => {
                this.setState({ placeholder: false, videoload: false });
              }, 100);
            })
          );
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      message.warning("Max 1 Video Allowed!", 2);
    }
    
  };

  getCaption = val => {
    this.setState({ caption: val });
  };

  render() {
    return (
      <div>
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
                  <VideoPlayer
                    className="p-2 text-center"
                    video={this.state.videoUrl}
                    play={this.props.stop}
                    style={{
                      width: "auto",
                      maxHeight: "30vw",
                      height: "auto"
                    }}
                  />
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
              <Button
                loading={this.state.loading}
                onClick={this.upload}
                size="large"
                className="w-100"
                type="primary"
              >
                Post
                <Icon type="double-right" />{" "}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default VideoPost;
