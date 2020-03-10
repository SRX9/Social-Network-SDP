import React from 'react';
import "./Edit.css";
import { Row, Col,message, Tabs,Modal, Icon, Button, Avatar } from 'antd';
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import Axios from 'axios';
import uniqid from 'uniqid';
import axios from 'axios';
import "video-react/dist/video-react.css";
import { Player, BigPlayButton, ControlBar, LoadingSpinner, VolumeMenuButton, Shortcut } from 'video-react';
import { MdCrop } from "react-icons/md";

const { TabPane } = Tabs;

class ChangeCover extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            imgurl:"",
            oriurl: this.props.user.coverPhoto.trim() === "" ? "http://localhost:3001/cover.png" : this.props.user.coverPhoto.trim(),
            vidurl: this.props.user.coverVideo === "" ? "https://cdn.videvo.net/videvo_files/converted/2018_01/preview/171124_H1_005.mp436952.webm" : this.props.user.coverVideo,

            placeholder:true,
            placeholder1: true,
            image:null,
            video:null,
            imgload:false,
            vidload:false,
            loading:false,
            cropmodal:false,
            crop: {
                aspect: 16 / 9,
                width: 400,
            }
        }
    }


    uploadPhoto = () => {
        if (this.state.image===null) {
            message.warning("Select at least one Photo to Post!", 2);
            return;
        }
        const obj = this.props.user;
        this.setState({ loading: true });
        var bodyFormData = new FormData();
        var img1 = new File([this.state.image], uniqid() + ".jpg");
        bodyFormData.append("img", img1);
        bodyFormData.append("username", obj.username);
        axios.put('http://localhost:3001/edit/EditCoverPhotoUser', bodyFormData)
            .then(res => {
                if (res.data) {
                    this.setState({ loading: false })
                    this.props.changePhoto(res.data);
                    this.setState({ imgurl:res.data });
                }
                else {
                    message.error("Server Down! Please Try After Sometime.", 1)
                    this.setState({ loading: false ,image:null})
                }
            })
            .catch(err => {
                this.setState({ loading: false })
                message.warning("Server error!", 4);
                console.log(err)
            });
    }

    uploadVideo=()=>{
        if (this.state.video === null) {
            message.warning("Select New video for Cover!", 2);
            return;
        }
        const obj = this.props.user;
        this.setState({ loading: true });
        var bodyFormData = new FormData();
        var vid = new File([this.state.video], uniqid() + ".mp4");
        bodyFormData.append("vid", vid);
        bodyFormData.append("username", obj.username);
        axios.put('http://localhost:3001/edit/EditCoverVideoUser', bodyFormData)
            .then(res => {
                if (res.data) {
                    this.setState({ loading: false })
                    this.props.changeVideo(res.data);
                    this.setState({ vidurl: res.data ,video:null});
                }
                else {
                    message.error("Server Down! Please Try After Sometime.", 1)
                    this.setState({ loading: false, image: null })
                }
            })
            .catch(err => {
                this.setState({ loading: false })
                message.warning("Server error!", 4);
                console.log(err)
            });
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
                        imgurl:reader.result,
                        oriurl: reader.result,
                        image: image,
                        //  cropmodal:true
                    },()=>{
                            this.setState({ placeholder: false, imgload: false });     
                    })
                );
                reader.readAsDataURL(e.target.files[0]);
            }
    };

    _handleVideoChange = async e => {
        if (
            e.target.files &&
            e.target.files.length > 0 &&
            e.target.files.length < 2
        ) {
            this.setState({ vidload: true });
            const reader = new FileReader();
            let file = e.target.files[0];
            if (file.size > 157286400) {
                message.warning("Video Size Should be less than 150MB!", 4);
                this.setState({ vidload: false });
                return;
            }
            let blobURL = URL.createObjectURL(file);
            var video = document.createElement("video");
            video.preload = "metadata";
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = async () => {
                window.URL.revokeObjectURL(blobURL);
                if (video.duration > 3010) {
                    message.warning(
                        "Video Duration should be less than 5 Minutes!",
                        3
                    );
                    this.setState({ vidload: false });
                    return;
                }
                else {
                    reader.addEventListener("load", async () =>
                        this.setState({ vidurl: reader.result, video: file }, () => {
                            setTimeout(() => {
                                this.setState({ placeholder1: false, vidload: false });
                            }, 100);
                        })
                    );
                }
            };
            await reader.readAsDataURL(e.target.files[0]);
        } else {
            message.warning("Select New Video ", 2);
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
                                        height: "45vh",
                                        width: "auto"
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
                                {/*<span
                                    onClick={() => this.cropopen()}
                                    className="p-2 pl-1 pr-1 ml-3 grow pointer boro shadow-1"
                                >
                                    Crop
                                </span>*/}
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
                                    height: "45vh",
                                    width: "auto"
                                }}
                            />
                        </div>}
                        <div className="pt-2">
                            <Button loading={this.state.loading} onClick={this.uploadPhoto} className="w-50" shape="round" type="primary">Save</Button>
                        </div>
                </TabPane>
                <TabPane tab="Change Cover Video" key="2">
                    {this.state.placeholder1 ? (
                        !this.state.vidload ? (
                            <div className=" tc ">
                                <form>
                                    <label for="file-input31a3">
                                        <div className="p-2 pointer grow pl-3 boro pr-3 shadow-1">Change</div>
                                    </label>

                                    <input
                                        name="img"
                                        id="file-input31a3"
                                        className="fileInput31a3"
                                        type="file"
                                        style={{ display: "none" }}
                                        accept=".mp4"
                                        multiple={false}
                                        onChange={e => this._handleVideoChange(e)}
                                    />
                                </form>
                                <Player
                                    playsInline
                                    className="pointer bor border"
                                    autoPlay
                                    src={this.state.vidurl}
                                    autoPlay
                                    controls
                                    style={{
                                        height: "auto",
                                        borderRadius:"15px",
                                        width: "100%"
                                    }}
                                >
                                    <Shortcut clickable={true} />
                                    <LoadingSpinner />
                                    <VolumeMenuButton disabled />

                                    <ControlBar autoHide={true} autoHideTime={true}>
                                    </ControlBar>
                                    <BigPlayButton position="center" />
                                </Player>
                            </div>
                        ) : (
                                <div className="tc  ">
                                    <h1>Loading</h1>
                                </div>
                            )
                    ) : <div className="text-center">

                            <form>
                                <label for="file-input41a2a">
                                    <div className="p-2 pl-3 pr-3 grow pointer boro shadow-1">Change</div>
                                </label>

                                <input
                                    name="vid"
                                    id="file-input41a2a"
                                    className="fileInput41a2a"
                                    type="file"
                                    style={{ display: "none" }}
                                    accept=".mp4"
                                    multiple={false}
                                    onChange={e => this._handleVideoChange(e)}
                                />
                            </form>
                            <Player
                                playsInline
                                className="pointer bor border"
                                autoPlay
                                src={this.state.vidurl}
                                autoPlay
                                controls
                                style={{
                                    height: "auto",
                                    width: "100%"
                                }}
                            >
                                <Shortcut clickable={true} />
                                <LoadingSpinner />
                                <VolumeMenuButton disabled />

                                <ControlBar autoHide={true} autoHideTime={true}>
                                </ControlBar>
                                <BigPlayButton position="center" />
                            </Player>
                        </div>}
                    <div className="pt-2">
                        <Button loading={this.state.loading} onClick={this.uploadVideo} className="w-50" shape="round" type="primary">Save</Button>
                    </div>
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