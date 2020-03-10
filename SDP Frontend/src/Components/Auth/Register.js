import React from "react";
import { Link} from "react-router-dom";
import { Row, Col } from "antd";
import { Form, Input, Button,Icon } from "antd";
import { Helmet } from "react-helmet";
import axios from 'axios';
import Registernext from "./Registernext";
import { withRouter } from 'react-router-dom';

import "./auth.css";


const serverUrl = "http://localhost:3001/";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameCheck: "",
      userHelp:"",
      valuser:"",

      passwordCheck: "",
      passHelp:"",
      fullHelp:"",
      fullnameCheck:"",

      Username: "",
      password:"",
      fullname:"",

      next:false,
    };
  }

  componentWillMount()
  {
    if (localStorage.getItem('$#@!') !==null) {
      this.props.history.push(`/home`);
    }
  }

  checkAndGetUsername= async (event)=>{
    let uname = event.target.value.replace(/\s/g, '');
    if(uname==="")
    {
      this.setState({Username:"",valuser:"", usernameCheck: "warning", userHelp: "Enter a Username" });
      return;
    }
    this.setState({usernameCheck:"validating"});
    await axios.get(`${serverUrl}auth/checkUsername?username=${uname}`)
      .then((response)=> {
        
        if(response.data)
        {
          this.setState({ usernameCheck: "success", userHelp: "", Username: uname, valuser:uname});
        }
        else{
          
          this.setState({ usernameCheck: "error", userHelp: "Username already exists!", Username: "", valuser: uname });
        }
        
      })
      .catch((error)=> {
        this.setState({
          usernameCheck: "warning",
          userHelp: "Server Down!. Please try again later. Very sorry for Inconvinency."
        });
      })
  }
  checkAndGetPaassword=(event)=>{
     this.setState({password:event.target.value});
  }
  checkandGetFullname=(event)=>{
    let fname = event.target.value;
    if (fname === "") {
      this.setState({ fullnameCheck: "warning",fullHelp:"Enter you Fullname."});
      return;
    }
    this.setState({ fullname: event.target.value, fullnameCheck: "success"});
  }

  flip=()=>{
    if(this.state.Username==="")
    {
      this.setState({usernameCheck:"error"});
    }
    else if(this.state.fullname==="")
    {
      this.setState({fullnameCheck:"error"});
    }
    else if(this.state.password.length<8 )
    {
      this.setState({passwordCheck:"error",passHelp:"Password should contain atleast 8 Characters"});
    }
    else{
      
      this.setState({next:true});
    }
  }
  
  successCreate=(obj)=>{
    this.props.setHomeUser(obj);
  }


  render() {
    return (
      <div style={{ overflow: "hidden" }}>
        <Helmet>
          <meta
            name="AyeFan SignUp"
            content="AyeFan Create Account"
            charSet="utf-8"
          />
          <title>Sign Up - AyeFan</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <Row type="flex" justify="center" className="full" style={{marginTop:"1vw"}}>
          <Col xs={2} sm={4} md={6} lg={7} xl={9}></Col>
          <Col
            xs={20}
            sm={16}
            md={12}
            lg={10}
            xl={6}
            className="text-center p-3 pl-4 pr-4 bg-light  rounded"
          >
            <br></br>
            <h4 className="display-4 aye ">
              Aye<span className="fan">Fan</span>
            </h4>
            <hr></hr>

            {/* Register one */}
            {!this.state.next ? (
              <div>
                <div className=" pl-4 pr-4">
                  <Link to="/SignIn">
                    <Button size="default" className="w-75" type="primary">
                      Already have an Account? Sign in
                    </Button>
                  </Link>
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
                    help={this.state.userHelp}
                    validateStatus={this.state.usernameCheck}
                  >
                    <Input
                      spellCheck={false}
                      value={this.state.valuser.toLocaleLowerCase().replace(/\s/g, '')}
                      size="default"
                      autoFocus
                      style={{textTransform:"lowercase"}}
                      onChange={this.checkAndGetUsername}
                      maxLength="25"
                      placeholder="Username"
                      prefix={<p style={{paddingTop:"1rem", color: 'rgba(0,0,0,.25)',fontSize:"1.05rem",
                      fontWeight:600
                      }}>@</p>}
                    />
                  </Form.Item>
                  <Form.Item
                    className=" pl-3 pr-3"
                    hasFeedback
                    help={this.state.fullHelp}
                    validateStatus={this.state.fullnameCheck}
                  >
                    <Input
                      spellCheck={false}
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      size="default"
                      maxLength="35"
                      onChange={this.checkandGetFullname}
                      placeholder="Full Name"
                    />
                  </Form.Item>
                  <Form.Item
                    className="pl-3 pr-3"
                    hasFeedback
                    help={this.state.passHelp}
                    validateStatus={this.state.passwordCheck}
                  >
                    <Input.Password maxLength="30" prefix={<Icon type="block" style={{ color: 'rgba(0,0,0,.25)' }} />}  onChange={this.checkAndGetPaassword} size="default" placeholder="Password" />
                  </Form.Item>
                  <div className=" pl-3 pr-3">
                    <Row className="pb-3 pl-3 pr-3 text-center">
                      <Col
                        className="text-grey text-muted font-weight-normal"
                        xs
                        style={{ fontSize: "1.45vh" }}
                      >
                        <span
                          className="text-info"
                          style={{ fontWeight: "900", fontSize: "1.7vh" }}
                        >
                          &#10003;
                        </span>{" "}
                        On Creating Account, you agree to our Terms and
                        Conditions, Cookies and Data Policy.
                      </Col>
                    </Row>

                    <Row className="pt-2">
                      <Col xs>
                        <Button size="default" onClick={this.flip} className="w-100" type="primary">
                          Go!
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>
            ) : (
              <Registernext 
                  successCreate={this.successCreate}
                  loadOn={this.props.loadOn}
                  loadOff={this.props.loadOff}
                  username={this.state.Username} 
                  password={this.state.password}
                  fullname={this.state.fullname} />
            )}

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

export default withRouter(Register);
