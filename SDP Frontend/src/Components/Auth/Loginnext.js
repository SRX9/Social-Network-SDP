import React from "react";
import {withRouter} from 'react-router-dom';
import { Form, Input,Icon, Button ,Row, Col} from 'antd';
import axios from 'axios';
import "antd/dist/antd.css";


const serverUrl = "http://localhost:3001/";

class Loginnext extends React.Component {
  constructor(props)
  {
    super(props);
    this.state={
      password:"",
      passwordCheck:"",
      passwordHelp:""
    }
  }

  Signin=()=>{
    axios.post(`${serverUrl}auth/signin`, {
      username: this.props.username,
      password: this.state.password
    }).then((response)=> {
        if(response.data)
        {
          localStorage.setItem("uname",this.props.username);
          this.props.history.push(`/profile/${this.props.username}`);
        }
        else{
          this.setState({passwordCheck:"error",passwordHelp:"Incorrect Password"});
        }
      })
  }

  render() {
    return <div className="">
      <Form className="text-left mb-3 p-2">
          <Form.Item
            className=" pl-3 pr-3"
            hasFeedback
            validateStatus={this.state.passwordCheck}
            help={this.state.passwordHelp}
          >
            <Input.Password
              size="default"
              maxLength="25"
              prefix={<Icon type="block" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onChange={(event) => this.setState({ password: event.target.value })}
              placeholder="Password"
            />
          </Form.Item>
          <Row className="pl-3 pr-3">
            <Col xs>
              <Button size="default" onClick={this.Signin} className="w-100" type="primary">
                Sign In
              </Button>
            </Col>
          </Row>
      </Form>
    </div>;
  }
}

export default withRouter(Loginnext);
