import React from "react";
import { Row, Col, Modal, Button, Radio,Icon, message } from "antd";
import "./utilities.css";
import { MdCrop } from "react-icons/md";
import axios from 'axios';
import ReactCrop from "react-image-crop";
import Swiper from 'react-id-swiper';
import "react-image-crop/dist/ReactCrop.css";
import SRtext from "./SRtext";
import "swiper/css/swiper.css";
import uniqid from 'uniqid';

const posture =require('../photo.png');
const params = {
  autoHeight: true,
  spaceBetween: 0,
  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: true,
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};

class PhotoPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeurl:"",
      activeindex:0,
      imgload:false,
      loading:false,
      caption:"",
      arr:[],
      cropmodal: false,
      placeholder: true,
      croppedImageUrl: "",
      visible:1,
      reactionStat:1,
      crop: {
        unit: "%",
        x: 130,
        y: 50,
        width: 200,
        height:200
      }
    };
  }

  upload=()=>{
    if(this.state.placeholder && this.state.arr.length<=0)
    {
      message.warning("Select at least one Photo to Post!",2);
      return; 
    }
    const obj=this.props.userobj
    this.setState({loading:true});
    var bodyFormData = new FormData();
    for(let i=0;i<this.state.arr.length;i++)
    {
      var img1 =new File([this.state.arr[i].img], uniqid() + ".jpg");
      bodyFormData.append("img", img1);
    }
    bodyFormData.append("userid", obj._id);
    bodyFormData.append("username",obj.username);
    bodyFormData.append("fullname", obj.fullname);
    bodyFormData.append("avatar", obj.avatar);
    bodyFormData.append("time", new Date());
    bodyFormData.append("text", this.state.caption);
    bodyFormData.append("visible", this.state.visible);
    bodyFormData.append("reactionStat", this.state.reactionStat==1?true:false);
    axios.put('http://localhost:3001/createpost/uploadPhotoPost', bodyFormData)
        .then(res => {
          if(res.data.stat)
          {
            this.setState({loading:false})
            this.setState({ placeholder: true ,caption:""}, () => { this.setState({ arr: [] }) });
          }
          else{
            message.error("Server Down! Please Try After Sometime.",1)
            this.setState({ loading: false })
          }
        })
    .catch(err =>{ 
      this.setState({ loading: false })
      message.warning("Server error!", 4);
      console.log(err)});
  }

  cropclose = () => {
    this.setState({ cropmodal: false, imgurl: this.state.croppedImageUrl });
  };
  cropopen = (index) => {
    this.setState({activeurl:this.state.arr[index].oriurl,activeindex:index},()=>{this.setState({ cropmodal: true })});
  };

  change=(e,index)=>{
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0 ) {
      let temp = this.state.arr;
      let image = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () =>{
          temp[index].imgurl = reader.result;
          temp[index].oriurl = reader.result;
          temp[index].img=image;
          this.setState({ arr: temp });

        }
        );
        reader.readAsDataURL(e.target.files[0]);
      }
      else{alert("asdas")}
  }

  _handleImageChange =async e => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0 && e.target.files.length < 16) {
      let temp=[];
      this.setState({imgload:true})
      for(let i=0;i<e.target.files.length;i++)
      {
        let image = e.target.files[i];
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        temp.push({
          imgurl: reader.result,
          oriurl: reader.result,
          img:image
        })
      );
      reader.readAsDataURL(e.target.files[i]);
      }
      this.setState({arr:temp},()=>{
        setTimeout(() => { this.setState({ placeholder: false,imgload:false }) }, 3000);
      });
    }
    else{
      message.warning('Max 15 Images Allowed!',2);
    }
  };

  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      let temp=this.state.arr;
      temp[this.state.activeindex].imgurl=croppedImageUrl;
      this.setState({ arr:temp });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    canvas.toBlob(blob => {
      if (!blob) {
        //reject(new Error('Canvas is empty'));
        console.error("Canvas is empty");
        return;
      }
      blob.name = fileName;
      let temp=this.state.arr;
      temp[this.state.activeindex].img=blob;
      this.setState({ arr:temp});
    }, "image/jpeg");
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  getCaption=(val)=>{
    this.setState({caption:val});
  }

  render() {
    return (
      <div>
        <Row type="flex" justify="center">
          <Col
            span={13}
            className="bg-white bor border m-2"
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
                      accept="image/*"
                      multiple={true}
                      style={{ display: "none" }}
                      onChange={e => this._handleImageChange(e)}
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
                <Button onClick={()=>{this.setState({placeholder:true},()=>{this.setState({arr:[]})})}}
                 className="shadow" type="default" shape="round">
                  <Icon type="delete" /> All
                </Button>
                <div >
                  {this.state.arr.length===1?
                      <div className="text-center pb-3 p-3 ">
                        <span className="text-left">
                          <span
                            onClick={() => this.cropopen(0)}
                            className="float-right"
                          >
                            <Button shape="circle" type="primary">
                              <MdCrop
                                style={{ fontSize: "1.2rem" }}
                                className="pt-1"
                              />
                            </Button>
                          </span>
                          <form>
                            <label for={`file-input${0}`}>
                              <div className="p-1 m-1 pl-2 bor dim shadow-1 pr-2 shadow pointer ">
                                <Icon type="reload" />
                              </div>
                            </label>
                            <input
                              id={`file-input${0}`}
                              className={`file-input${0}`}
                              type="file"
                              name="img"
                              accept=".jpg, .jpeg, .png"
                              multiple={false}
                              style={{ display: "none" }}
                              onChange={e => this.change(e, 0)}
                            />
                          </form>
                        </span>
                        <img
                          src={this.state.arr[0].imgurl}
                          className="pt-1 pl-2 pr-2 pb-2 tc text-center  "
                          style={{
                            borderRadius: "15px",
                            width: "80%",
                            height: "auto"
                          }}
                        />
                      </div>
                  :
                    <Swiper {...params}>
                      {this.state.arr.map((obj, index) => (
                        <div className="text-center">
                          <span className="text-left">
                            <span
                              onClick={() => this.cropopen(index)}
                              className="float-right"
                            >
                              <Button shape="circle" type="primary">
                                <MdCrop
                                  style={{ fontSize: "1.2rem" }}
                                  className="pt-1"
                                />
                              </Button>
                            </span>
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
                                accept="image/*"
                                multiple={false}
                                style={{ display: "none" }}
                                onChange={e => this.change(e, index)}
                              />
                            </form>
                          </span>
                          <img
                            src={obj.imgurl}
                            className="pt-1 pl-2 pr-2 pb-2 tc text-center  "
                            style={{
                              borderRadius: "15px",
                              width: "auto",
                              height: "auto",
                              maxHeight:"55vh"
                            }}
                          />
                        </div>
                      ))}
                </Swiper>}
                  </div>

              </div>
            )}
          </Col>
          <Col
            span={7}
            className="bg-white text-left p-3 bor border m-2"
            style={{ Height: "300px" }}
          >
            <h6 className="text-muted">Caption</h6>
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

export default PhotoPost;
