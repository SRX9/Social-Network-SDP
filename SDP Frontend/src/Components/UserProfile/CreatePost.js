import React from 'react';
import {withRouter} from 'react-router-dom';
import { Row, Col, Tabs, Icon, Button, Avatar } from 'antd';
import "./Profile.css";
import "../../App.css";
import PhotoPost from '../Utilities/PhotoPost';
import { FiCamera, FiHeadphones, FiPlayCircle, FiEdit2} from "react-icons/fi";
import VideoPost from '../Utilities/VideoPost';
import AudioPost from '../Utilities/AudioPost';
import Texty from '../Utilities/Texty';

const { TabPane } = Tabs;


class CreatePost extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
          stop:true

        }
    }

    componentWillMount()
    {
      if (localStorage.getItem("!@#$") === null || localStorage.getItem("$#@!")===null)
      {
        this.props.history.push(`/signin`);

      }
      if (this.props.userobj!==null)
      {
        if (localStorage.getItem("!@#$") !== null && this.props.match.params.username !== undefined && this.props.userobj.username === this.props.match.params.username) {
          return;
        }
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
                    <div
                      style={{
                        fontSize: "180%",
                        fontWeight: "600",
                      }}
                      className="text-dark d-inline-block shadow-4 name  text-center   overflow-hidden text-break fixed-top ayefan"
                    >
                      ayefan
                    </div>
                  </Col>
                </Row>
              </div>
            </Row>
            <div className=" text-center mt-5 pt-3">
              <Row type="flex" justify="center">
                <Col
                  span={20}
                  className="bg-light border pb-4"
                  style={{ borderRadius: "20px", minHeight: "380px" }}
                >
                  <Tabs
                    defaultActiveKey="1"
                    tabBarStyle={{ textAlign: "center" }}
                  >
                    <TabPane
                   
                      tab={
                        <span  style={{ fontSize: "1.55rem" }}>
                          <FiCamera />
                        </span>
                      }
                      key="1"
                    >
                      <PhotoPost   userobj={this.props.userobj} />
                    </TabPane>
                    <TabPane
                    
                      tab={
                        <span  style={{ fontSize: "1.55rem" }}>
                          <FiPlayCircle />
                        </span>
                      }
                      key="2"
                    >
                      <VideoPost  userobj={this.props.userobj} />
                    </TabPane>
                    <TabPane
                      tab={
                        <span  style={{ fontSize: "1.55rem" }}>
                          <FiHeadphones />
                        </span>
                      }
                      key="3"
                    >
                      <AudioPost  userobj={this.props.userobj}/>
                    </TabPane>
                    <TabPane
                    
                      tab={
                        <span onClick={this.stop} style={{ fontSize: "1.55rem" }}>
                          <FiEdit2 />
                        </span>
                      }
                      key="4"
                    >
                      <Texty userobj={this.props.userobj}/>
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