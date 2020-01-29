import React from 'react';
import {withRouter} from 'react-router-dom';
import { Row, Col, Tabs, Icon, Button, Avatar } from 'antd';
import "./Profile.css";
import "../../App.css";
import PhotoPost from '../Utilities/PhotoPost';
import { FiCamera, FiHeadphones, FiPlayCircle, FiEdit2} from "react-icons/fi";
import VideoPost from '../Utilities/VideoPost';

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
        return (
          <div className="w-100">
            <Row align="center">
              <div className="">
                <Row className="">
                  <Col xs={24}>
                    <div class="row border-bottom nav justify-content-center p-1 text-center">
                      <div class="col-md-auto">
                        <span
                          style={{
                            fontSize: "2rem",
                            fontWeight: "500"
                          }}
                          className="aye "
                        >
                          A
                          <span style={{}} className="fan ">
                            F
                          </span>
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Row>
            <div className=" text-center">
              <Row type="flex" justify="center">
                <Col
                  span={20}
                  className="bg-light pb-4"
                  style={{ borderRadius: "20px", minHeight: "380px" }}
                >
                  <Tabs
                    defaultActiveKey="1"
                    tabBarStyle={{ textAlign: "center" }}
                  >
                    <TabPane
                      tab={
                        <span style={{ fontSize: "1.55rem" }}>
                          <FiCamera />
                        </span>
                      }
                      key="1"
                    >
                      <PhotoPost userobj={this.props.userobj} />
                    </TabPane>
                    <TabPane
                      tab={
                        <span style={{ fontSize: "1.55rem" }}>
                          <FiPlayCircle />
                        </span>
                      }
                      key="2"
                    >
                      <VideoPost userobj={this.props.userobj} />
                    </TabPane>
                    <TabPane
                      tab={
                        <span style={{ fontSize: "1.55rem" }}>
                          <FiHeadphones />
                        </span>
                      }
                      key="3"
                    >
                      Audio
                    </TabPane>
                    <TabPane
                      tab={
                        <span style={{ fontSize: "1.55rem" }}>
                          <FiEdit2 />
                        </span>
                      }
                      key="4"
                    >
                      Texty
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>
            </div>
          </div>
        );
    }
}


export default withRouter(CreatePost);