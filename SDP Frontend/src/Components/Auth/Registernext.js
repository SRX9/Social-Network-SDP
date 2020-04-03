import React from "react";
import { Row, Col } from "antd";
import { Form, Input,Select,Icon, message,Button } from "antd";
import axios from 'axios';
import validator from 'email-validator';
import { CountryRegionData } from 'react-country-region-selector';
import "./auth.css";
import { withRouter } from "react-router-dom";

const serverUrl = "http://localhost:3001/";
const { Option } = Select;

class Registernext extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryList:CountryRegionData,
      emailCheck: "",
      emailhelp: "",
      email: "",
      
      country: "",
      countryCheck:"",

      region:"Select a Region",
      regionCheck:"",

      temp:true,
      countryData:[]
    };
  }

  componentWillMount=()=>{
    let countryRegion=[];
    for(var i=0;i<CountryRegionData.length;i++)
    {
      let country = CountryRegionData[i][0];
      let regionArr=CountryRegionData[i][2].split("|")
      let region=[];
      for(var j=0;j<regionArr.length;j++)
      {
        let temp=regionArr[j];
        let end;
        for(var k=temp.length-1;k>0;k--)
        {
          if(temp[k]==="~")
          {
            end=k;
            break;
          }
        }
        region.unshift(temp.slice(0,end));
      }
      countryRegion.unshift({country:country,regions:region});
    }
    this.setState({countryData:countryRegion.reverse()});
  }

  emailGetandCheck = (event) => {
    let ename = event.target.value;
    if (ename === "") {
      this.setState({
        emailCheck: "warning",
      });
      return;
    }
    if (!validator.validate(ename)) {
      this.setState({
        emailCheck: "error",
        emailHelp:""
      });
      return;
    }
    axios.get(`${serverUrl}auth/checkEmail?email=${ename}`)
        .then((response) => {
          if (response.data) {
            this.setState({ emailHelp: "", email :ename},()=>{
              this.setState({ emailCheck: "success", });
            });
          }
          else {
            this.setState({
              email:"",
              emailCheck: "error",
            });          
          }
        })
        .catch((error) => {
          this.setState({
            emailCheck: "warning",
            emailHelp: "Server Down!. Please try again later. Very sorry for Inconvinency."
          });
      })
    
  };

  selectCountry=(event)=> {
    let index=0;
    for(var i=0;i<this.state.countryData.length;i++)
    {
      if(this.state.countryData[i].country===event)
      {
        index=i;
        break;
      }
    }
    this.setState({ countryCheck: "", countryhelp: "" });
    this.setState({temp:false,country: event,
      SelectedCountry:this.state.countryData[index].regions,region:"Select a Region"});
  }

  selectRegion=(event)=> {
    this.setState({ regionCheck: "", regionhelp: "" });
    this.setState({ region: event,temp:true});
  }

  CreateAccount=()=>{
    let allright=true;
    if(this.state.email==="")
    {
      allright=false;
      this.setState({emailCheck:"error",emailhelp:"Enter your email."});
    }
    if(this.state.country==="")
    {
      allright = false;
      this.setState({ countryCheck: "error", countryhelp: "Select your Country." });
    }
    else{
      if (this.state.region ==="Select a Region")
      {
        allright = false;
        this.setState({ regionCheck: "error", regionhelp: "Select your Region." });
      }
    }
    if(!this.state.temp)
    {
      allright = false;
      this.setState({ regionCheck: "error", regionhelp: "" });
    }
    else{
      this.setState({ regionCheck: "", regionhelp: "" });
    }
    if(allright)
    {
      this.setState({loading:true},()=>{
        axios.post(`${serverUrl}auth/registerOne`, {
          username: this.props.username,
          fullname: this.props.fullname,
          password: this.props.password,
          email: this.state.email,
          country: this.state.country,
          region: this.state.region
        })
          .then((response) => {
            this.setState({ loading: false });
            if (response.data.state) {
              localStorage.setItem("!@#$", this.props.username);
              localStorage.setItem("$#@!", response.data.id);
              localStorage.setItem("ava", response.data.obj.avatar);
              this.props.successCreate(response.data.obj);
              this.props.history.push(`/profile/${this.props.username}`);
            }
            else {
              this.setState({ loading: false });
              message.warning('Server Down. Please try again later.');
            }
          })
      })

    }
  }


  render() {
    return (
      <div>
        <Form className="text-left p-2">
          <Form.Item
            className=" pl-3 pr-3"
            
            hasFeedback
            help={this.state.emailhelp}
            validateStatus={this.state.emailCheck}
          >
            <Input
              size="default"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              style={{ textTransform: "lowercase" }}
              onChange={this.emailGetandCheck}
              maxLength="80"
              autoFocus
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
              className=" pl-3 pr-3"
              hasFeedback
              validateStatus={this.state.countryCheck}
              help={this.state.regionhelp}
            >
              <Select
                showSearch
                placeholder="Select Country."
                optionFilterProp="children"
                onChange={this.selectCountry}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.countryData.map(data => (
                  <Option value={data.country}>{data.country}</Option>
                ))}
              </Select>
            </Form.Item>
          <Form.Item
              className=" pl-3 pr-3"  
            hasFeedback
            help={this.state.regionhelp}
            validateStatus={this.state.regionCheck}    
            >
              <Select    
                showSearch
                value={this.state.region}
                placeholder="Select Region."
                optionFilterProp="children"
                onChange={this.selectRegion}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >

                {this.state.country===""?null:
                 this.state.SelectedCountry.map(data => (
                  <Option value={data}>{data}</Option>
                ))
                }
              </Select>
            </Form.Item>


          <div className="pt-3 pl-3 pr-3">
            <Row className="pb-3 pl-3 pr-3 text-center">
              <Col
                className="text-grey text-muted font-weight-normal"
                xs
                style={{ fontSize: "1.45vh" }}
              >
               <span className="text-info font-weight-normal">Note: </span> 
               Please Provide Correct Details. It's for you own Account's Security.
              </Col>
            </Row>

            <Row className="pt-2">
              <Col xs>
                <Button
                loading={this.state.loading}
                  size="default"
                  onClick={this.CreateAccount}
                  className="w-100"
                  type="primary"
                >
                  Create Account
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    );
  }
}

export default withRouter(Registernext);
