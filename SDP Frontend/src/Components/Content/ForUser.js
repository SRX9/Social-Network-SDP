import React from 'react';
import './Search.css';
import { Tabs, Input, Row, Col, Card, Avatar, Typography } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const key ="wenevergooutofstyle";

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
            loading: false,
            open:false,
            recent:[]
        }
    }

    componentDidMount()
    {
        let arr = localStorage.getItem(key);
        if (arr === null) {
            arr = []
            localStorage.getItem(key, JSON.stringify(arr))
        }
        else {
            arr = JSON.parse(arr);
            this.setState({recent:arr});
        }
    }

    onUserSearch = (val) => {
            this.setState({ loading: true,open:true })
            axios.get(`${serverUrl}search/finduser?token=${val.target.value}`).then(res => {
                this.setState({ users: res.data, loading: false })
            })
    }
    
    clicked=(obj)=>{
        axios.get(`${serverUrl}search/incSearch?userid=${obj._id}`).then(res=>{})
        let arr=localStorage.getItem(key);
        if(arr===null)
        {
            arr=[]
            arr.push(obj._id);
            localStorage.getItem(key,JSON.stringify(arr))
        }
        else{
            arr=JSON.parse(arr);
            arr.push(obj);
            localStorage.setItem(key,JSON.stringify(arr))
        }
    }

    render() {
        return (
            <div>
                <div>
                    <Card className="border-0" title={<Search className="w-25 border-0" onChange={this.onUserSearch} 
                        placeholder="Search for Profiles..." loading={this.state.loading} />}>
                        {!this.state.open?
                        <div>
                            <Title level={3} className="text-black-50 p-2">Recent</Title>
                            {this.state.recent.map((obj,i)=>{
                                return <Card.Grid className="border-0 pointer dim" hoverable={false} style={gridStyle}>
                                    <Link  to={`profile/${obj.name}`}><div className="inshadow" style={{
                                        backgroundImage: `url(${obj.cover})`,
                                        height: "200px", backgroundPosition: "center", position: "relative", backgroundSize: "cover"
                                    }}>
                                        <div className="p-2 pl-3 w-100" style={{
                                            fontSize: "120%",
                                            position: "absolute",
                                            bottom: "0"
                                        }}>
                                            <div className="w-100">
                                                <Avatar size="large" className="float-left" src={obj.avatar} />
                                                <Text strong className="text-white float-left  pt-1 pl-1" style={{ bottom: 0, paddingTop: "3px" }}>{obj.name}</Text>
                                                <Text strong className="text-white pr-1 float-right pt-3 " style={{ bottom: 0 }}>{obj.fullname}</Text>
                                            </div>
                                        </div>
                                    </div></Link>
                                </Card.Grid>
                            })}
                        </div>
                        :this.state.users.length === 0 ?
                            <Title level={3} className="p-3 text-dark">No results found.</Title>
                            : this.state.users.map((obj,i)=>{
                            return <Card.Grid className="border-0 pointer dim" hoverable={false} style={gridStyle}>
                                <Link onClick={()=>this.clicked(obj)} to={`profile/${obj.name}`}><div className="inshadow" style={{backgroundImage:`url(${obj.cover})`,
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