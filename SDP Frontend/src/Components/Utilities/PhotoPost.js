import React from "react";
import { Row, Col, Modal, Button } from "antd";
import "./utilities.css";
import { MdCrop } from "react-icons/md";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
const posture =require('../photo.png');

class PhotoPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgblob: null,
      imgObj: null,
      oriurl: "",
      imgurl: "",
      cropmodal: false,
      placeholder: true,
      croppedImageUrl: "",
      crop: {
        unit: "%",
        x: 130,
        y: 50,
        width: 200,
        height:200
      }
    };
  }

  cropclose = () => {
    this.setState({ cropmodal: false, imgurl: this.state.croppedImageUrl });
  };
  cropopen = () => {
    this.setState({ cropmodal: true });
  };

  _handleImageChange = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({
          imgurl: reader.result,
          placeholder: false,
          cropmodal: true,
          oriurl: reader.result
        })
      );
      reader.readAsDataURL(e.target.files[0]);
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
      this.setState({ croppedImageUrl });
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
      this.setState({ imgObj: blob });
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

  render() {
    return (
      <div>
        <Row type="flex" justify="center">
          <Col span={12} className="bg-white br border m-2" style={{ minHeight: "30vw" }}>

              {this.state.placeholder ? (
                <div className="p-4 tc  ">
                  <form>
                    <label for="file-input">
                      <div
                        className=" pointer "
                        style={{
                          backgroundImage: "url(" + posture + ")",
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          border: "none",
                          borderRadius: "0px 0px 0px 0px",
                          height: "30vh",
                          width: "30vw"
                        }}
                      ></div>
                    </label>
                    <input
                      name="img"
                      id="file-input"
                      className="fileInput"
                      type="file"
                      accept="image/*"
                      multiple={false}
                      style={{ display: "none" }}
                      onChange={e => this._handleImageChange(e)}
                    />
                  </form>
                </div>
              ) : (
                  <div className="text-center pb-3">
                    <span className="text-left">
                      <span
                        onClick={this.cropopen}
                        className="pointer text-left grow fr dib bg-white shadow-2 pt-1 pl-2 pr-2  b--white  ba br-pill "
                      >
                        <MdCrop fontSize="1.4rem" />
                      </span>
                      <form>
                        <label for="file-input">
                          <div className=" dib  bg-white shadow-2 f5 float-left  b--white pa2  br-pill black pointer grow ">
                            change
                      </div>
                        </label>
                        <input
                          id="file-input"
                          className="fileInput"
                          type="file"
                          name="img"
                          accept="image/*"
                          multiple={false}
                          style={{ display: "none" }}
                          onChange={e => this._handleImageChange(e)}
                        />
                      </form>
                    </span>
                    <img
                      src={this.state.imgurl}
                      className="p-2 tc text-center  "
                      style={{
                        borderRadius: "15px",
                        width: "auto",
                        maxHeight: "30vw",
                        height: "auto"
                      }}
                    />
                  </div>
                )}
          </Col>
          <Col span={7} className="bg-white br border m-2" style={{ minHeight: "30vw" }}>

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
              minWidth="300 "
              imageStyle={{
                maxWidth: "50vw",
                borderRadius: "15px",
                maxHeight: "60vh",
                height: "auto",
                width: "auto"
              }}
              src={this.state.oriurl}
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
