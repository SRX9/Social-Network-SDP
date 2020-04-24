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
              <Col span={8}>
                <Row>
                  <Col
                    className="m-2 p-3 bor text-left border"
                    xs={24}
                  >
                    <h5>
                      {this.props.obj.fullname}
                    </h5>
                      <p style={{ fontSize: "1rem",whiteSpace:"pre-wrap", fontWeight: "500" }}>
                      {this.props.obj.intro}
                    </p>    
                  </Col>
                </Row>
                <Row>
                  <Col
                    className="m-2 p-3 text-center bor border"
                    xs={24}
                  >
                    <Row >
                      <Col span={12} className="w-100" >
                        <Statistic className="text-center" title={'Fanned-In'} value={this.props.obj.fanins} />
                      </Col>
                      <Col span={12} className="w-100">
                        <Statistic className="text-center" title={'Searched'} value={this.props.obj.search} prefix={<Icon type="search" />} />
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