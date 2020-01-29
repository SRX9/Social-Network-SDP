import React from "react";
import { Row, Col, Modal, Button, Radio, Icon, message } from "antd";
import "./utilities.css";
import { MdCrop } from "react-icons/md";
import axios from "axios";
import ReactCrop from "react-image-crop";
import Swiper from "react-id-swiper";
import "react-image-crop/dist/ReactCrop.css";
import SRtext from "./SRtext";
import "swiper/css/swiper.css";
import uniqid from "uniqid";

const posture = require("../video.png");
const params = {
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    hide: false,
    clickable: true
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  spaceBetween: 30
};

class VideoPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeurl: "",
      activeindex: 0,
      imgload: false,
      loading: false,
      caption: "",
      arr: [],
      placeholder: true,
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
    if (this.state.arr.length <= 0) {
      message.warning("Select at least one Photo to Post!", 2);
      return;
    }
    const obj = this.props.userobj;
    this.setState({ loading: true });
    var bodyFormData = new FormData();
    for (let i = 0; i < this.state.arr.length; i++) {
      var img1 = new File([this.state.arr[i].img], uniqid("hello-") + ".jpeg");
      bodyFormData.append("img", img1);
    }
    bodyFormData.append("username", obj.username);
    bodyFormData.append("avatar", obj.avatar);
    bodyFormData.append("time", new Date());
    bodyFormData.append("text", this.state.caption);
    bodyFormData.append("visible", this.state.visible);
    bodyFormData.append("reactionStat", this.state.reactionStat);
    axios
      .put("http://localhost:3000/uploadVideoPost", bodyFormData)
      .then(res => {
        if (res.data) {
          this.setState({ loading: false });
        } else {
          message.error("Server Down! Please Try After Sometime.", 2);
        }
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  change = (e, index) => {
    if (e.target.files && e.target.files.length > 0) {
      let temp = this.state.arr;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        temp[index].videourl = reader.result;
        temp[index].video = reader;
        this.setState({ arr: temp });
      });
      reader.readAsDataURL(e.target.files[0]);
    } 
  };

  _handleVideoChange = e => {
    if (
      e.target.files &&
      e.target.files.length > 0 &&
      e.target.files.length < 4
    ) {
      let temp = [];
      this.setState({ imgload: true });
      for (let i = 0; i < e.target.files.length; i++) {
        const reader = new FileReader();
        reader.addEventListener("load", () =>
          temp.push({
            videourl: reader.result,
            video: reader
          })
        );
        reader.readAsDataURL(e.target.files[i]);
      }
      this.setState({ arr: temp }, () => {
        setTimeout(() => {
          this.setState({ placeholder: false, imgload: false });
        }, 3000);
      });
    } else {
      message.warning("Max 3 Video Allowed!", 2);
    }
  };

  onImageLoaded = image => {
    this.imageRef = image;
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
            style={{ Height: "300px" }}
          >
            {this.state.placeholder ? (
              !this.state.imgload ? (
                <div className="p-4 tc  ">
                  <form>
                    <label for="file-input">
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
                      id="file-input"
                      className="fileInput"
                      type="file"
                      accept="video/*"
                      multiple={true}
                      style={{ display: "none" }}
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
                <Button
                  onClick={() => {
                    this.setState({ placeholder: true }, () => {
                      this.setState({ arr: [] });
                    });
                  }}
                  className="shadow"
                  type="danger"
                  shape="round"
                >
                  <Icon type="delete" /> All
                </Button>

                <Swiper {...params}>
                  {this.state.arr.map((obj, index) => (
                    <div className="text-center pb-3">
                      <span className="text-left">
                        <form>
                          <label for={`file-input${index}`}>
                            <div className="p-1 m-1 pl-2 bor dim shadow-1 pr-2 shadow pointer ">
                              <Icon type="reload" />
                            </div>
                          </label>
                          <input
                            id={`file-input${index}`}
                            className={`file-input${index}`}
                            type="file"
                            name="img"
                            accept="video/*"
                            multiple={false}
                            style={{ display: "none" }}
                            onChange={e => this.change(e, index)}
                          />
                        </form>
                      </span>
                      <img
                        src={obj.videourl}
                        className="p-2 tc text-center  "
                        style={{
                          borderRadius: "15px",
                          width: "auto",
                          maxHeight: "30vw",
                          height: "auto"
                        }}
                      />
                    </div>
                  ))}
                </Swiper>
              </div>
            )}
          </Col>
          <Col
            span={7}
            className="bg-white text-left p-3 bor border m-2"
            style={{ Height: "300px" }}
          >
            <h6 className="text-muted">Caption</h6>
            <SRtext rows={8} getCaption={this.getCaption} />
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
        <Modal
          title="Crop"
          centered
          width="400"
          height="400"
          footer={null}
          visible={this.state.cropmodal}
          onCancel={this.cropclose}
        >
          <div>
            <ReactCrop
              minHeight="400"
              maxHeight="700"
              minWidth="450"
              imageStyle={{
                maxWidth: "50vw",
                borderRadius: "15px",
                height: "60vh",
                width: "auto"
              }}
              src={this.state.activeurl}
              crop={this.state.crop}
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          </div>

          <Button
            shape="round"
            className="w-100"
            type="primary"
            size="large"
            onClick={this.cropclose}
          >
            Crop
          </Button>
        </Modal>
      </div>
    );
  }
}

export default VideoPost;
