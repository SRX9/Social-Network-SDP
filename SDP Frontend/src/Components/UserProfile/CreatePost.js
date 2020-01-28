import React from 'react';
import {withRouter} from 'react-router-dom';
import { Row, Col, Tabs, Icon, Button, Avatar } from 'antd';
import "./Profile.css";
import "../../App.css";
import PhotoPost from '../Utilities/PhotoPost';
import { FiCamera, FiHeadphones, FiPlayCircle, FiEdit2} from "react-icons/fi";

const { TabPane } = Tabs;


class CreatePost extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={

        }
    }

    componentWillMount()
    {
        if (localStorage.getItem("!@#$") !== null && this.props.match.params.username!==undefined)
        {
            return;
        }
        else{
            this.props.history.push(`/signin`);
        }
    }

    render()
    {
        return(
            <div>
                <Row align="center">
                    <div className="">
                        <Row className="">
                            <Col xs={24}>
                                <div class="row border-bottom nav justify-content-center p-1 text-center">
                                    <div class="col-md-auto">
                                        <span
                                style={{
                                  fontSize: "2rem",
                                  fontWeight: "500",
                                }}
                                className="aye "
                              >
                                A
                                <span
                                  style={{ }}
                                  className="fan "
                                >
                                  F
                                </span>
                              </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Row>
                <div className=" text-center" >
                    <div  className="text-muted pt-2 font-weight-bolder  text-center" 
                    style={{ marginBottom: "4px",fontSize:"1.4rem" }}> + Create Post</div>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={20} className="bg-light pb-4" style={{borderRadius:"10px",minHeight: "38vw" }}>
                            <Tabs defaultActiveKey="1" 
                            tabBarStyle={{ textAlign: 'center' }}>
                                <TabPane
                                    tab={
                                        <span  style={{fontSize:"1.55rem"}}>
                                        <FiCamera/>
                                        </span>
                                    }
                                    key="1"
                                >
                                    <PhotoPost/>
                            </TabPane>
                            <TabPane
                                    tab={
                                        <span style={{ fontSize: "1.55rem" }}>
                                            <FiPlayCircle/>
                                        </span>
                                    }
                                    key="2"
                                >
                                    Video
                            </TabPane>
                                <TabPane
                                    tab={
                                        <span style={{ fontSize: "1.55rem" }}>
                                            <FiHeadphones/>
                                        </span>
                                    }
                                    key="3"
                                >
                                    Audio
                            </TabPane>
                            <TabPane
                                tab={
                                    <span style={{ fontSize: "1.55rem" }}>
                                        <FiEdit2/>
                                    </span>
                                }
                                key="4"
                            >
                                Texty
                            </TabPane>
                            
                            </Tabs>
                        </Col>
                        <Col span={2}></Col>
                    </Row>

                </div>
            </div>
        )
    }
}


export default withRouter(CreatePost);