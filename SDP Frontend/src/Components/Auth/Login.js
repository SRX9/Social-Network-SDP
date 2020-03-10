import React from "react";
import {Link,} from 'react-router-dom';
import { Row, Col } from "antd";
import { Form,Icon, Input,Button} from 'antd';
import { Helmet } from "react-helmet";
import Loginnext from './Loginnext';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const serverUrl = "http://localhost:3001/";

class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
          identifier:"",
          identifierCheck:"",
          identifierHelp:"",
          next:false
            
        };
    }

    flip=()=>{ 
      if(this.state.identifier==="")
      {
        this.setState({identifierCheck:"warning",identifierHelp:""});
      }
      else{
        axios.get(`${serverUrl}auth/signinCheck?identifier=${this.state.identifier}`)
          .then((response) => {
            if(response.data)
            {

              this.setState({ next: true, identifierCheck: "success" });
            }
            else{
              this.setState({ identifierCheck: "error", identifierHelp: "Invalid Credentials" });

            }

          }).catch(error=>{
            this.setState({identifierCheck:"warning",identifierHelp:"Server Down! Please try again later. We are sorry for inconvinency."})
          });
      }
      
    }

    componentWillMount()
    {
      if (localStorage.getItem('$#@!')!==null)
      {
        this.props.history.push(`/home`);
      }
    }

  successCreate = (obj) => {
    this.props.setHomeUser(obj);
  }


    render()
    {
        return (
          <div style={{ overflow: "hidden" }}>
            <Helmet>
              <meta
                name="AyeFan SignIn"
                content="AyeFan Login"
                charSet="utf-8"
              />
              <title>Sign In - AyeFan</title>
              <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Row type="flex" justify="center" className="full" style={{ marginTop: "1vw" }}>
              <Col xs={2} sm={4} md={6} lg={7} xl={9}></Col>
              <Col xs={20} sm={16} md={12} lg={10} xl={6} 
                className="text-center p-3 pl-4 pr-4 bg-light  rounded">
                <br></br>
                <h4 className="display-4 aye ">
                  Aye<span className="fan">Fan</span>
                </h4>
                <hr></hr>
                <div className=" pl-4 pr-4">
                  <Link to="/CreateAccount">
                    <Button size="default" className="w-75" type="primary">
                      New To AyeFan? Sign Up
                  </Button>
                  </Link>
                </div>
                <p className="pt-3" style={{ fontSize: "1.8vh" }}>
                  or
                  <span
                    className="pl-2"
                    style={{ fontSize: "2vh", fontWeight: 500 }}
                  >
                    Sign In.
                  </span>
                </p>
               
                  {this.state.next?
                    <Loginnext 
                    successCreate={this.successCreate}
                    loadOn={this.props.loadOn}
                    loadOff={this.props.loadOff}
                    username={this.state.identifier}/>
                    :  
                  <Form className="text-left mb-3 p-2">
                    <Form.Item
                      className=" pl-3 pr-3"
                      hasFeedback
                      
                      validateStatus={this.state.identifierCheck}
                      help={this.state.identifierHelp}
                    >
                      <Input
                        size="default"
                        maxLength="25"
                        autoFocus
                        spellCheck={false}
                        value={this.state.identifier.toLowerCase().replace(/\s/g, '')}
                        style={{ textTransform: "lowercase" }}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        onChange={(event) => this.setState({ identifier: event.target.value.replace(/\s/g, '') })}
                        placeholder="Username or Email"
                      />
                    </Form.Item>
                    <div className=" pl-3 pr-3">
                      <Row>
                        <Col xs>
                          <Button size="default" onClick={this.flip} className="w-100" type="primary">
                            Next
                        </Button>
                        </Col>
                      </Row>

                    </div>

                  </Form>
                  }

                <hr></hr>
                <div class="d-flex justify-content-center">
                  <Link className="d-inline  p-1">About </Link>
                  <span className="p-1">&bull;</span>
                  <Link className="d-inline  p-1"> Privacy </Link>
                  <span className="p-1">&bull;</span>
                  <Link className="d-inline  p-1"> Terms and Conditions </Link>
                  <span className="p-1">&bull;</span>
                  <Link className="d-inline  p-1"> Data and Cookies </Link>
                </div>
                <div className="pt-3">
                  <h6 className="text-secondary">AyeFan © 2020 </h6>
                  <h5 className="mainCompany pt-2">SRx</h5>
                </div>
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

export default withRouter(Login);