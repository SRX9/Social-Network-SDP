import React from 'react';
import './Edit.css';
import { Tabs, Form, Input,Typography,Row,Col,message, DatePicker,Avatar, TimePicker, Select, Cascader, InputNumber, Button, Divider  } from 'antd';
import { CountryRegionData } from 'react-country-region-selector';
import axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

message.config({
    top: 80,
    duration: 2,
    maxCount: 1,
});
const serverUrl = "http://localhost:3001/";

class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countryList: CountryRegionData,
            country: this.props.user.country,
            countryCheck: "",
            region: this.props.user.region,
            regionCheck: "",
            temp: true,
            countryData: [],
            SelectedCountry:[],

            placeholder:true,
            imgurl: this.props.user.avatar,
            image:null,
            loading:false,
            imageload:false,

            usernamestat:"",
            userHelp:"",
            fullstat:"",
            username:this.props.user.username,
            fullname:this.props.user.fullname,
            avatar: this.props.user.avatar === "" ? "http://localhost:3001/AF.png" : this.props.user.avatar,
            bio:this.props.user.intro
        }
    }

    checkAndGetUsername = async (event) => {
        let uname = event.target.value.replace(/\s/g, '');
        if (uname[uname.length - 1] === "-" || uname[uname.length - 1] === "~" || uname[uname.length - 1] === "=" || uname[uname.length - 1] === "/" || uname[uname.length - 1] === "-" || uname[uname.length - 1] === "+" || uname[uname.length - 1] === "*    ")
        {
            return;
        }
        if (uname === "") {
            this.setState({ username: "", usernamestat: "warning", userHelp: "Enter a Username" });
            return;
        }
        this.setState({ usernameCheck: "validating",username:uname });
        axios.get(`${serverUrl}auth/checkUsername?username=${uname}`)
            .then((response) => {

                if (response.data || this.state.username===uname) {
                    this.setState({ usernamestat: "success", userHelp: ""});
                }
                else {

                    this.setState({ usernamestat: "error", userHelp: "Username already exists!", Username: "", valuser: uname });
                }

            })
            .catch((error) => {
                this.setState({
                    usernameCheck: "warning",
                    userHelp: "Server Down!. Please try again later. Very sorry for Inconvinency."
                });
            })
    }

    save=()=>{
        if (this.state.fullname === "") {
            this.setState({ fullstat: "warning"});
            return;
        }
        if (this.state.region === null || this.state.region === "") {
            message.warning("Select your Region", 2);
            return;
        }

        this.setState({ loading: true });
        var bodyFormData = new FormData();

        if (!this.state.placeholder ) {
            bodyFormData.append("avatar", this.state.image);
        }
        bodyFormData.append("userid", this.props.user._id);
        bodyFormData.append("username", this.state.username);
        localStorage.setItem("!@#$",this.state.username);
        bodyFormData.append("fullname", this.state.fullname);
        bodyFormData.append("bio", this.state.bio);
        bodyFormData.append("country", this.state.country);
        bodyFormData.append("region", this.state.region);
        axios
            .put("http://localhost:3001/edit/EditUserDetail", bodyFormData)
            .then(res => {
                if (res.data) {
                    console.log(res.data)
                    this.props.updateUser(res.data);
                    message.success("Profile Updated Successfully", 2);
                    this.setState({ loading: false, caption: "" }, () => { this.setState({ placeholder1: true, placeholder2: true }) });
                } else {
                    message.error("Server Error! Please Try After Sometime.", 2);
                    this.setState({ loading: false });
                }
            })
            .catch(err => {
                this.setState({ loading: false });
                message.warning("Server Error! Please Try After Sometime.", 4);
                console.log(err)
            });

    }

    componentWillMount = () => {
        let countryRegion = [];
        for (var i = 0; i < CountryRegionData.length; i++) {
            let country = CountryRegionData[i][0];
            let regionArr = CountryRegionData[i][2].split("|")
            let region = [];
            for (var j = 0; j < regionArr.length; j++) {
                let temp = regionArr[j];
                let end;
                for (var k = temp.length - 1; k > 0; k--) {
                    if (temp[k] === "~") {
                        end = k;
                        break;
                    }
                }
                region.unshift(temp.slice(0, end));
            }
            countryRegion.unshift({ country: country, regions: region });
        }

        this.setState({ countryData: countryRegion.reverse() },()=>{
            this.selectCountry(this.props.user.country);
            this.selectRegion(this.props.user.region);
        });
    }

    selectCountry = (event) => {
        let index = 0;
        for (var i = 0; i < this.state.countryData.length; i++) {
            if (this.state.countryData[i].country === event) {
                index = i;
                break;
            }
        }
        this.setState({ countryCheck: "", countryhelp: "" });
        this.setState({region:null, temp: false, country: event,region:"", SelectedCountry: this.state.countryData[index].regions });
    }

    selectRegion = (event) => {

        this.setState({ regionCheck: "", regionhelp: "" });
        this.setState({ region: event, temp: true });
    }
    _handleAvatarChange = async e => {
        this.setState({ imageload: true });
        const reader = new FileReader();
        let file = e.target.files[0];
        if (file.size > 52428800) {
            message.warning('Size of Avatar should be less than 50MB', 2);
            return;
        }
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                this.setState({ imgurl: reader.result, image: file }, () => this.setState({ placeholder: false, imageload: false }))
            );
            reader.readAsDataURL(e.target.files[0]);
        }
        else {
            message.warning('Select a Photo!', 2);
        }
    }

    render() {
        return (
            <div className="bor text-center w-100 bg-white p-3" >
                <div className="pb-3">
                    <Title level={2}>Edit Profile Details</Title>
                </div>
                <div className="">
                    <Row type="flex" justify="space-around" align="middle">
                        <Col xs={8} sm={9} md={10} lg={11} xl={8} className="">
                            {this.state.placeholder ?
                                !this.state.imageload ? <div>
                                    <Avatar style={{ width: "8vw", height: "8vw" }} src={this.state.avatar} />
                                    <form>
                                        <label for="file-input3a1">
                                            <h6 className="myblue pt-2 pointer link">Change Avatar</h6>
                                        </label>
                                        <input
                                            name="img"
                                            id="file-input3a1"
                                            className="fileInput3a1"
                                            type="file"
                                            style={{ display: "none" }}
                                            accept=".jpg, .png, .jpeg"
                                            multiple={false}
                                            onChange={e => this._handleAvatarChange(e)}
                                        />
                                    </form>
                                </div> :
                                    <div>Loading</div>
                                : <div>
                                    <Avatar style={{ width: "8vw", height: "8vw" }} 
                                    src={this.state.imgurl} />
                                    <form>
                                        <label for="file-input3a1">
                                            <h6 className="myblue pt-2 pointer link">Change Avatar</h6>
                                        </label>
                                        <input
                                            name="img"
                                            id="file-input3a1"
                                            className="fileInput3a1"
                                            type="file"
                                            style={{ display: "none" }}
                                            accept=".jpg, .png, .jpeg"
                                            multiple={false}
                                            onChange={e => this._handleAvatarChange(e)}
                                        />
                                    </form>
                                </div>}
                        </Col>
                        <Col xs={16} sm={15} md={14} lg={13} xl={14} className="text-left">
                            <Title  level={4} className=" d-inline-block">Bio</Title>    
                            <p className="f-1 float-right d-inline-block pt-2">{this.state.bio.length}/160</p>                        
                            <TextArea onChange={(e)=>this.setState({bio:e.target.value})} 
                            maxLength={160} value={this.state.bio}  
                            style={{resize:"none",fontWeight:"600"}} rows={5} />
                        </Col>
                    </Row>
                    <Divider/>
                </div>
                <Form  className="w-100">
                    <Row type="flex" gutter={16} justify="center">
                        <Col span={12} className="text-left">
                            <Form.Item
                                label="Username"
                                hasFeedback
                                help={this.state.userHelp}
                                validateStatus={this.state.usernamestat}
                            >
                                <Input onChange={this.checkAndGetUsername}
                                    maxLength={45}
                                    value={this.state.username.toLowerCase()} id="validating" />
                            </Form.Item>
                            <Form.Item
                                label="Full Name"
                                validateStatus={this.state.fullstat}
                                hasFeedback
                            >
                                <Input value={this.state.fullname}
                                    onChange={e => this.setState({ fullname: e.target.value })}
                                    maxLength={35}
                                    id="validating" />
                            </Form.Item>
                        </Col>
                        <Col span={12} className="text-left">
                            <Form.Item
                                label="Country"
                                className='mr-2'
                            >
                                <Select
                                    defaultValue={this.state.country}
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
                                label="Region"
                                className='mr-2'

                            >
                                <Select
                                    value={this.state.region}
                                    showSearch
                                    placeholder="Select Region."
                                    optionFilterProp="children"
                                    onChange={this.selectRegion}
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >

                                    {this.state.country === "" ? null :
                                        this.state.SelectedCountry.map(data => (
                                            <Option value={data}>{data}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                        </Col>
                    </Row>
                   <Button shape="round" className="float-right" onClick={this.save} loading={this.state.loading} className=" w-25" type="primary">Save</Button>
                </Form>
            </div>
        )
    }
}

export default EditUser;