import React from 'react';
import axios from 'axios';
import { Row, Col, Tabs, Icon, Button, Avatar} from 'antd';
import DashBoard from './Dashboard';
import Posts from './Posts';
import Inbox from './Inbox';
import Story from './Story';
import './Profile.css';
import { responsiveMap } from 'antd/lib/_util/responsiveObserve';

const { TabPane } = Tabs;
const serverUrl = "http://localhost:3001/";

class Profile extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            userObj:null,
            loading:true,
            exist:true,
            error:"",
            errorFlag:false
        }
    }

    componentWillMount()
    {
        this.props.loadOn();
        axios.get(`${serverUrl}data/getUserProfile?username=${this.props.match.params.username}`)
            .then((response) => {
                this.props.loadOff();
                if (response.data !==false) {
                    this.setState({ loading:false, userObj:response.data},()=>{
                    });
                }
                else {
                    this.setState({ exist:false });
                }
            }).catch(error => {
                this.props.loadOff();
                this.setState({errorFlag:true, error: "Server Down! Please try again later. We are sorry for inconvinency." })
            });
    }

    render()
    {
        if(this.state.loading)
        {
            return (
                <div>
                    loading
                </div>
            );
        }
        else{
            return (
              <div>
                <div
                  className="layer"
                  style={{
                    backgroundImage: `url(${this.state.userObj.coverPhoto})`,
                    backgroundSize: "cover",
                    height: "84vh",
                    width: "100%",
                    backgroundPosition: "center"
                  }}
                >
                  <Row align="center">
                    <div className="fixed-top">
                      <Row className="">
                        <Col xs={24}>
                          <div class="row fixed-top pronav justify-content-center p-1 text-center">
                            <div class="col-md-auto">
                              <span
                                style={{
                                  fontSize: "2rem",
                                  fontWeight: "500",
                                  textShadow: "1px 1px 1px #000000"
                                }}
                                className="aye text-white"
                              >
                                A
                                <span
                                  style={{ textShadow: "1px 1px 1px white" }}
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
                  <Row>
                    <Col xs={24} style={{ marginTop: "3.9rem" }} className="">
                      <Button
                        shape="circle"
                        size="large"
                        type="default"
                        className="m-3  d-inline  "
                      >
                        <Icon type="video-camera" />
                      </Button>

                      <Icon
                        className="ico d-inline  float-right  btn"
                        style={{ fontSize: "2rem" }}
                        type="setting"
                      />
                      <Button
                        shape="round"
                        type="primary"
                        className="mt-2 d-inline  float-right  btn"
                      >
                        <Icon type="edit" /> Change Cover
                      </Button>
                    </Col>
                  </Row>
                </div>
                <div
                  className="bg-white layer"
                  style={{
                    position: "absolute",
                    height: "100px",
                    width: "100%"
                  }}
                >
                  <div class="row justify-content-md-center">
                    <div
                      class="col col-lg-2 text-right"
                      style={{ paddingTop: "7px" }}
                    >
                      <div className="w-50 float-right" style={{marginRight:"-45px"}}>
                        <div
                          className="cur pb-1 text-center"
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "500",
                            paddingTop: "px"
                          }}
                        >
                          {this.state.userObj.fans}
                          <span
                            className="gry"
                            style={{ fontSize: "1.4rem", fontWeight: "400" }}
                          >
                            {" "}
                            fans
                          </span>
                        </div>
                        <Button type="primary" className="w-100" shape="round">
                          Fan-in
                        </Button>
                      </div>
                    </div>
                    <div class="col-md-auto">
                      <Avatar
                        className="text-center"
                        style={{
                          border: "10px solid white",
                          height: "250px",
                          width: "250px",
                          top: "-150px"
                        }}
                        size="large"
                        src={this.state.userObj.avatar}
                      />
                    </div>
                    <div class="col col-lg-2  pt-2" style={{ marginLeft: "-35px" }}>
                      <div className=" text-left" >
                        <span
                          className=" myblue"
                          style={{ fontSize: "1.9rem", fontWeight: "600" }}
                        >
                          @{this.state.userObj.username}
                        </span>
                      </div>
                      <div className=" text-left" style={{ marginLeft: "-20px" }}>
                        <span
                          className="gry"
                          style={{ fontSize: "1rem", fontWeight: "500" }}
                        >
                          {this.state.userObj.fullname}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="sticky-top fixed-top" style={{ marginTop: "105px", paddingBottom: "50px" }}>
                  <Tabs
                    size="large"
                    defaultActiveKey="1"
                    style={{ textAlign: "center" }}
                  >
                    <TabPane tab="DashBoard" key="1">
                      <DashBoard obj={this.state.userObj} />
                    </TabPane>
                    <TabPane tab="Posts" key="2">
                      <Posts userid={this.state.userObj._id} />
                    </TabPane>
                    <TabPane tab="Inbox" key="3">
                      <Inbox obj={this.state.userObj} />
                    </TabPane>
                    <TabPane tab="Story" key="4">
                      <Story story={this.state.userObj.story} />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            );
        }

    }
}

export default Profile;