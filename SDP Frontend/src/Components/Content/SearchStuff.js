import React from 'react';
import './Search.css';
import { Tabs, Input, Row, Col } from 'antd';
import axios from 'axios';
import ForUser from './ForUser';
import ForGroup from './ForGroup';
import ForTag from './ForTag';

const {Search}=Input;
const { TabPane } = Tabs;
const serverUrl = "http://localhost:3001/";

class SearchStuff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            groups: [],
            tags: [],
            loading: false
        }
    }

    onUserSearch = (val) => {
        axios.get(`${serverUrl}searcg/finduser?token=${val.target.value}`).then(res => {
            this.setState({ users: res.data })
        })
    }

    render() {
        return (
            <Row justify="center" className="bg-light  text-center" style={{height:"100vh"}}>
                <Col xxl={4} xl={2} lg={0} md={0} sm={0} className="">
                </Col>
                <Col xxl={16} xl={20} lg={24} md={24} sm={24} className="">
                    <div className="bg-light pt-3 h-100">
                        <div
                            style={{
                                fontSize: "160%",
                                fontWeight: "600",
                            }}
                            className="text-dark p-1 bg-white shadow-4 pronav fixed-top ayefan"
                        >
                            search
                        </div>
                        <Tabs defaultActiveKey="1" className='text-center searchBox mt-5  br bg-white border'>
                            <TabPane tab="Profiles" key="1" className="overflow-scroll">
                                <ForUser/>
                            </TabPane>
                            {/*<TabPane tab="Groups" key="2" className="overflow-scroll">
                                <ForGroup/>
                            </TabPane>
                            <TabPane tab="Tags" key="3" className="overflow-scroll">
                                <ForTag/>
                        </TabPane>*/}
                        </Tabs>
                    </div>

                </Col>
                <Col xxl={4} xl={2} lg={0} md={0} sm={0} className="">
                </Col>
            </Row>
        )
    }
}


export default SearchStuff;