import React from "react";
import {Link} from 'react-router-dom';
import { Row, Col } from "antd";
import { Form, Input,Button} from 'antd';
class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            usernameCheck:"",
            passwordCheck:"",
            fullnameCheck:""
        };
    }


    render()
    {
        return (
          <div>
            <Row type="flex" justify="center" className="full">
              <Col xs={2} sm={4} md={6} lg={7} xl={9}></Col>
              <Col
                xs={20}
                sm={16}
                md={12}
                lg={10}
                xl={6}
                className="text-center p-3 bg-light  rounded"
              >
                <br></br>
                <h4 className="display-4 aye ">
                  Aye<span className="fan">Fan</span>
                </h4>
                <hr></hr>
                <div className=" pl-4 pr-4">
                  <Button size="large" className="w-100" type="primary">
                    Already have an Account? Sign in
                  </Button>
                </div>
                <p className="pt-3" style={{ fontSize: "1.8vh" }}>
                  or
                  <span
                    className="pl-2"
                    style={{ fontSize: "2vh", fontWeight: 500 }}
                  >
                    Create Now!
                  </span>
                </p>
                <Form className="text-left p-2">
                  <Form.Item
                    className=" pl-3 pr-3"
                    hasFeedback
                    validateStatus={this.state.usernameCheck}
                  >
                    <Input
                      size="large"
                      placeholder="Username"
                      id="validating"
                    />
                  </Form.Item>
                  <Form.Item
                    className=" pl-3 pr-3"
                    hasFeedback
                    validateStatus={this.state.fullnameCheck}
                  >
                    <Input
                      size="large"
                      placeholder="Full Name"
                      id="validating"
                    />
                  </Form.Item>
                  <Form.Item
                    className="pl-3 pr-3"
                    hasFeedback
                    validateStatus={this.state.passwordCheck}
                  >
                    <Input.Password size="large" placeholder="Password" />
                  </Form.Item>
                  <div className=" pl-3 pr-3">
                    <Row>
                      <Col xs>
                        <Link
                          style={{ fontSize: "1.7vh", fontWeight: "400" }}
                          className="float-right"
                        >
                          <h6>Forgot password?</h6>
                        </Link>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs>
                        <Button size="large" className="w-100" type="primary">
                          Create Account
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </Col>
              <Col xs={2} sm={4} md={6} lg={7} xl={9}></Col>
            </Row>
            <Row className="mob">
              <Col>
                <h1 className="display-4 ">AyeFan</h1>
              </Col>
            </Row>
          </div>
        );
    }
}

export default Login;