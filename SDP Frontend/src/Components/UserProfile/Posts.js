import React from 'react';
import axios from 'axios';
import OverPost from '../Utilities/OverPost';
import { Row, Col, Tabs, Icon,message, Button, Avatar } from 'antd';
import './Profile.css';

//1 text
//2 photo
//3 video
//4 audio

class Posts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          userid: this.props.userid,
          posts:[]
        };
    }

    componentWillMount()
    {
      axios.get('http://localhost:3001/data/getPosts', {
        params: {
          username:this.props.userid
        }
      })
      .then((response)=> {
        console.log(response.data)
        this.setState({posts:response.data})
      })
      .catch((error)=> {
        message.warning("Error fetching Posts!",2)
      })
    }

    render() {
        return (
            <div>
                <Row className="text-center pb-5 mb-5  p-3"  justify="center">
                    <Col span={1}>
                    </Col>
                    <Col span={22}>
                        <Row gutter={[16, 16]} justify="center" align="middle" className="border-0">
                            {this.state.posts.map(obj =>
                                <Col span={6}  >
                                    <OverPost obj={obj} />
                                </Col>
                            )}
                        </Row>
                    </Col>
                    <Col span={1}>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ height: "200px" }}></Col>
                </Row>
            </div>

        );
    }
}


export default Posts;