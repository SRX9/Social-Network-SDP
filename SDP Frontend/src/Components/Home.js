import React from 'react';
import {Link,withRouter} from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { message } from 'antd';

const serverUrl = "http://localhost:3001/";
class Home extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            userObj:this.props.userobj,
            loading:false,
        }
    }

    componentWillMount()
    {
        if(this.state.userObj===null && localStorage.getItem("!@#$")===null)
        {
            this.props.history.push(`/signin`);
        }
        else if(this.props.userObj===null){
            this.props.loadOn();
            axios.get(`${serverUrl}data/getUserProfile?username=${this.props.match.params.username}`)
                .then((response) => {
                    this.props.loadOff();
                    if (response.data !== false) {
                        this.setState({ loading: false, userObj: response.data }, () => {
                        });
                    }
                    else {
                        message.warning("Server Down! Please try again later. We are sorry for inconvinency.");
                    }
                }).catch(error => {
                    this.props.loadOff();
                    message.warning("Server Down! Please try again later. We are sorry for inconvinency." );
                });
        }
    }

    render()
    {
        return(
            <div>
                Hello {this.state.userObj._id}
            </div>
        )
    }
}

export default withRouter(Home);