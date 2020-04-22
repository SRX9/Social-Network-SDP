import React from 'react';
import './Search.css';
import { Tabs, Input, Row, Col, Card, Avatar, Typography } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const {Text,Title}=Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const serverUrl = "http://localhost:3001/";
const { Meta } = Card;
const gridStyle = {
    width: '33.33%',
    textAlign: 'center',
    position: "relative"
};
class ForUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: false
        }
    }

    onUserSearch = (val) => {
            this.setState({ loading: true })
            axios.get(`${serverUrl}search/finduser?token=${val.target.value}`).then(res => {
                this.setState({ users: res.data, loading: false })
            })
    }

    render() {
        return (
            <div>
                <div>
                    <Card className="border-0" title={<Search className="w-25 border-0" onChange={this.onUserSearch} 
                        placeholder="Search for Profiles..." loading={this.state.loading} />}>
                        {this.state.users.length === 0 ?
                            <Title level={3} className="p-3 text-dark">No results found.</Title>
                            : this.state.users.map((obj,i)=>{
                            return <Card.Grid className="border-0 pointer dim" hoverable={false} style={gridStyle}>
                                <Link to={`profile/${obj.name}`}><div className="inshadow" style={{backgroundImage:`url(${obj.cover})`,
                                    height: "200px", backgroundPosition: "center", position: "relative",backgroundSize:"cover"}}>
                                    <div className="p-2 pl-3 w-100" style={{fontSize:"120%",
                                        position: "absolute",
                                        bottom: "0"}}>
                                        <div className="w-100">
                                            <Avatar size="large" className="float-left" src={obj.avatar} />
                                            <Text strong className="text-white float-left  pt-1 pl-1" style={{ bottom: 0,paddingTop:"3px" }}>{obj.name}</Text>
                                            <Text strong className="text-white pr-1 float-right pt-3 " style={{ bottom: 0 }}>{obj.fullname}</Text>
                                        </div>
                                    </div>
                                </div></Link> 
                            </Card.Grid>
                        })}
                        </Card>
                </div>
            </div>
        )
    }
}


export default ForUser;