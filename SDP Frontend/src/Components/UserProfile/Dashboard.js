import React from 'react';
import axios from 'axios';
import SRtext from '../Utilities/SRtext';
import { Statistic, Row, Col, Icon  } from 'antd';
import './Profile.css';

class Dashboard extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={

        }
    }

    render()
    {
        return (
          <div className="text-center  pb-5">
            <Row type="flex" justify="center">
              <Col
                style={{ height: "600px" }}
                className="m-2 text-left pr-5 br  p-3 border"
                xs={6}
              >
                <h5>Updates</h5>
                <p style={{ fontSize: "1rem", fontWeight: "500" }}>
                  Building businesses and talent in entertainment Universal
                  Music Group Exec 🎵 LA ☀️
                </p>
              </Col>
              <Col xs={8}>
                <Row>
                  <Col
                    className="m-2 p-3 br text-left border"
                    xs={24}
                  >
                    <h5>Bio</h5>
                    <p style={{ fontSize: "1rem", fontWeight: "500" }}>
                      {this.props.obj.intro}
                    </p>    
                  </Col>
                </Row>
                <Row>
                  <Col
                    className="m-2 p-3 text-center br border"
                    xs={24}
                  >
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic  title={<h6 className="gry">Fanned-In</h6>} value={this.props.obj.fanins} />
                      </Col>
                      <Col span={6}>
                        <Statistic title={<h6 className="gry">Stalkers</h6>} value={this.props.obj.stalker}  />
                      </Col>
                      <Col span={6}>
                        <Statistic title={<h6 className="gry">Searched</h6>} value={this.props.obj.search} prefix={<Icon type="search" />} />
                      </Col>
                      <Col span={6}>
                        <Statistic title={<h6 className="gry">Monthly Streams </h6>} value={this.props.obj.monstreams}  />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col
                    className="m-2 p-3 text-left br border"
                    xs={24}
                  >
                    <h6>Groups</h6>
                    <Row gutter={16}>
                      <Col span={6}>
                        
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        );
    }
}


export default Dashboard;