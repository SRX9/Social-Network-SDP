import React from 'react';
import './Search.css';
import { Tabs, Input, Row, Col } from 'antd';
import axios from 'axios';

const { Search } = Input;
const { TabPane } = Tabs;
const serverUrl = "http://localhost:3001/";

class ForTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            <div>
                <Search className="w-25" placeholder="Search for Tags..." loading />
            </div>
        )
    }
}


export default ForTag;