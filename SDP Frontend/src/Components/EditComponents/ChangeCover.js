import React from 'react';
import "./Edit.css";
import { Row, Col, Tabs,Modal, Icon, Button, Avatar } from 'antd';
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import Axios from 'axios';
import { MdCrop } from "react-icons/md";

const { TabPane } = Tabs;

class ChangeCover extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            imgurl:"",
            oriurl: this.props.user.coverPhoto,
            placeholder:this.props.user.coverPhoto,
            image:null,
            imgload:false,
            cropmodal:false,
            crop: {
                aspect: 16 / 9,
                width: 400,
            }
        }
    }

    cropclose = () => {
        this.setState({ cropmodal: false});
    };
    cropopen = (index) => {
        this.setState({ cropmodal: true });
    };

    _handleImageChange = e => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0 && e.target.files.length <= 1) {
            this.setState({ imgload: true })
                let image = e.target.files[0];
                const reader = new FileReader();
                reader.addEventListener("load", () =>
                    this.setState({
                        oriurl: reader.result,
                        img: image,
                        cropmodal:true
                    },()=>{
                            console.log(reader.result)

                            this.setState({ placeholder: false, imgload: false });     
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

            this.setState({ imgurl: croppedImageUrl });
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
            
            this.setState({ image: blob });
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

    getCaption = (val) => {
        this.setState({ caption: val });
    }

    render()
    {
        return(<div className="bg-white p-3 changecover" style={{overflow:"hidden   "}}>

            <Tabs
                size="large"
                defaultActiveKey="1"
                style={{ textAlign: "center" }}
            >
                <TabPane tab="Change Cover Photo" key="1">
                    {this.state.placeholder ? (
                        !this.state.imgload ? (
                            <div className=" tc ">
                                <form>
                                    <label for="file-input313">
                                        <div className="p-2 pointer grow pl-3 boro pr-3 shadow-1">Change</div>
                                    </label>
                                    <input
                                        name="img"
                                        id="file-input313"
                                        className="fileInput313"
                                        type="file"
                                        style={{ display: "none" }}
                                        accept=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onChange={e => this._handleImageChange(e)}
                                    />
                                </form>
                                <img
                                    className="pointer bor border"
                                    src={this.state.oriurl}
                                    style={{
                                        height: "auto",
                                        width: "100%"
                                    }}
                                />
                            </div>
                        ) : (
                                <div className="tc  ">
                                    <h1>Loading</h1>
                                </div>
                            )
                    ) : <div className="text-center">

                            <form>
                                <label for="file-input412a">
                                    <div className="p-2 pl-3 pr-3 grow pointer boro shadow-1">Change</div>
                                </label>
                                <span
                                    onClick={() => this.cropopen()}
                                    className="p-2 pl-1 pr-1 ml-3 grow pointer boro shadow-1"
                                >
                                    Crop
                                </span>
                                <input
                                    name="img"
                                    id="file-input412a"
                                    className="fileInput412a"
                                    type="file"
                                    style={{ display: "none" }}
                                    accept=".jpg, .jpeg, .png"
                                    multiple={false}
                                    onChange={e => this._handleImageChange(e)}
                                />
                            </form>
                            <img
                                className="pointer bor border"
                                src={this.state.imgurl}
                                style={{
                                    height: "auto",
                                    width: "100%"
                                }}
                            />
                        </div>}
                        <div className="pt-2">
                            <Button className="w-50" shape="round" type="primary">Save</Button>

                        </div>
                </TabPane>
                <TabPane tab="Change Cover Video" key="2">
                    Cover Video
                </TabPane>
            </Tabs>
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
                            borderRadius: "15px",
                            height: "50vh",
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

        </div>);
    }
}


export default ChangeCover;