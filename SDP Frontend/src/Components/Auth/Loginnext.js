import React from "react";
import {withRouter,Link} from 'react-router-dom';
import { Form,message, Input,Icon, Button ,Row, Col} from 'antd';
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
  //iden ==!@#$
  Signin=()=>{
    this.setState({loading:true},()=>{
      axios.post(`${serverUrl}auth/signin`, {
        username: this.props.username,
        password: this.state.password
      }).then((response) => {
        this.setState({ loading: false });
        if (response.data.state) {
          localStorage.setItem("!@#$", response.data.username);
          localStorage.setItem("$#@!", response.data.id);
          localStorage.setItem("ava", response.data.obj.avatar);
          console.log(response.data.obj)
          this.props.successCreate(response.data.obj);

          this.props.history.push(`/profile/${response.data.username}`);
        }
        else {
          this.setState({ passwordCheck: "error", passwordHelp: "Incorrect Password" });
        }
      }).catch((error) => {
        this.setState({ loading: false });
        message.warning('Server Down. Please try again later.');
      })
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
              autoFocus
              prefix={<Icon type="block" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onChange={(event) => this.setState({ password: event.target.value })}
              placeholder="Password"
            />
          </Form.Item>
        <Row>
          <Col xs>
            <Link
              style={{ fontWeight: "400" }}
              className="float-right"
            >
              <p style={{ fontSize: "1rem", fontWeight: 400 }}>Forgot password?</p>
            </Link>
          </Col>
        </Row>
          <Row className="pl-3 pr-3">
            <Col xs>
              <Button size="default" loading={this.state.loading} onClick={this.Signin} className="w-100" type="primary">
                Sign In
              </Button>
            </Col>
          </Row>
      </Form>
    </div>;
  }
}

export default withRouter(Loginnext);
