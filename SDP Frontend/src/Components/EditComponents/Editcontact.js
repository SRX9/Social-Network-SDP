import React from 'react';
import './Edit.css';
import axios from 'axios';
import { Tabs, Form,Typography, Input,Icon, DatePicker, Avatar, TimePicker, Select, Cascader, InputNumber, Button, message } from 'antd';
import validator from 'email-validator';
message.config({
    top: 80,
    duration: 2,
    maxCount: 1,
});
const { Title } = Typography;
const { TabPane } = Tabs;

const serverUrl = "http://localhost:3001/";

class Editcontact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user:this.props.user,
            emailCheck: "",
            phoneCheck:"",
            updating:false,
            changed:false,
            emailhelp: "",
            email: this.props.user.email,
            phone: this.props.user.phone||"",
        }
    }

    emailGetandCheck = (event) => {
        this.setState({changed:true});
        let ename = event.target.value;
        this.setState({email:ename});
        if (ename === "") {
            this.setState({
                emailCheck: "warning",
                changed:false
            });
            return;
        }
        if (!validator.validate(ename)) {
            this.setState({
                emailCheck: "error",
                emailHelp: "",
                email: ename,
                changed: false
            });
            return;
        }
        axios.get(`${serverUrl}auth/checkEmail?email=${ename}`)
            .then((response) => {
                if (response.data||this.state.email===ename) {
                    this.setState({ emailHelp: ""}, () => {
                        this.setState({ emailCheck: "success", changed: true });
                    });
                }
                else {
                    this.setState({
                        emailCheck: "error", changed: false
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    emailCheck: "warning",
                    changed: false,
                    emailHelp: "Server Down!. Please try again later. Very sorry for Inconvinency."
                });
            })

    };

    save=()=>{
        if(this.state.phone.toString().length!==10)
        {
            this.setState({phoneCheck: "error"});
            return;
        }
        if(this.state.changed)
        {
            this.setState({ updating: true });
            axios({
                method: 'put',
                url: serverUrl + 'edit/EditContactDetail',
                data: {
                    userid: this.props.user._id,
                    email: this.state.email,
                    phone: this.state.phone || 0
                }
            }).then(res => {
                this.setState({ updating: false });
                if (res.data.stat) {
                    this.props.updateUser(res.data.obj);
                    message.success("Updated Successfully!", 2000)
                }
                else {
                    message.warning("Update Failed! Please try again after some Time.", 2000)
                }
            }).catch(e => {
                this.setState({ updating: false });
                message.warning("Update Failed! Please try again after some Time.", 2000)
            });
        }
    }

    getPhone = (e) => {
        let num=e.target.value;
        if(num.toString().length<=10)
        {
            this.setState({ phone: num, changed:false });
        }
        if(num.toString().length===10)
        {
            this.setState({ phone: num, phoneCheck: "success", changed:true });
        }
    }
    render() {
        return (
            <div className="bor w-100 bg-white p-3" >
                <div className="text-center p-3 pb-4">
                    <Title level={2}>Edit Contact Details</Title>
                    <p className="text-info">Provide correct Contact details. It will help Securing your Account.</p>
                </div>
                <Form className="text-left ml-3 mr-3">
                    <Form.Item
                        hasFeedback
                        label="Email"
                        help={this.state.emailhelp}
                        validateStatus={this.state.emailCheck}
                    >
                        <Input
                            size="default"
                            value={this.state.email}
                            style={{ textTransform: "lowercase" }}
                            onChange={this.emailGetandCheck}
                            maxLength="80"
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Phone Number"
                        hasFeedback
                        validateStatus={this.state.phoneCheck}
                    >
                        <Input value={this.state.phone}  onChange={this.getPhone} id="validating" />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={this.save} 
                        loading={this.state.updating} type="primary" shape="round " 
                        className="text-center w-25">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Editcontact;