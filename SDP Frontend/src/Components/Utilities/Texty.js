import React from "react";
import { Row, Col, Modal, Avatar, Button, Radio, Icon, message } from "antd";
import "./utilities.css";
import axios from "axios";
import SRtext from "./SRtext";
import Swiper from "react-id-swiper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



class Texty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            icons: ["FaExclamation",
                "FaQuoteLeft",
                "FaQuestion",
                "FaEllo",
                "FaFlushed",
                "FaSadCry",
                "FaSkull",
                "FaMehBlank",
                "FaFrown",
                "FaGrimace",
                "FaGrinAlt",
                "FaGrinBeamSweat",
                "FaGrinHearts",
                "FaStar",
                "FaRegLightbulb",
                "FaGrinBeam",
                "FaLaughWink",
                "FaGrinSquint",
                "FaGrinStars",
                "FaGrinWink",
                "FaGrinTongueWink",
                "FaHandsHelping",
                "FaHeart",
                "FaHeartBroken",
                "FaStudiovinari",
                "FaSistrix",
                "FaAward",
                "FaCoffee",
                "FaCocktail",
                "FaCrown",
                "FaGlassMartiniAlt",
                "FaGlassCheers",
                "FaFire",
                "FaAngellist",
                "FaBirthdayCake",
                "FaBell",
                "FaBan"
            ],
            loading: false,
            caption: "",
            length: 0,
            visible: 1,
            reactionStat: 1
        };
    }


    upload = () => {
        if (this.state.caption.trim() === "") {
            message.warning("Write something to Post!", 2);
            return;
        }
        this.setState({loading:true});
        axios.post('http://localhost:3001/createpost/uploadTextPost', {
            username: this.props.userobj.username,
            fullname: this.props.userobj.fullname,
            userid:this.props.userobj._id,
            text:this.state.caption,
            visible:this.state.visible,
            reactionStat:this.state.reactionStat===1?true:false,
            time:new Date(),
            avatar: this.props.userobj.avatar
        })
            .then((response)=> {
                this.setState({loading:false,caption:""})
            })
            .catch((error) =>{
                this.setState({ loading: true });
                message.warning("Server error!",4)
                console.log(error);
            });
    };

    getCaption = val => {
        if (val.length < 251) {
            this.setState({ caption: val, length: val.length });
        }
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="center">
                    <Col
                        xs={10}
                        className="bg-white text-left p-3 bor border m-2"
                        style={{ Height: "30vh" }}
                    > 
                        <h6 className="float-right pb-1">{this.state.length}/250</h6>
                        <SRtext limit={250} place={"Write your thoughts..."} rows={7} done={this.state.caption} getCaption={this.getCaption} />
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

export default Texty;
