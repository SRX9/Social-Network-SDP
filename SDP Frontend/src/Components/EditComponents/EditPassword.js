import React from 'react';
import './Edit.css';
import axios from 'axios';
import { Tabs, Form, Typography, Input, Icon, DatePicker, Avatar, TimePicker, Select, Cascader, InputNumber, Button, message } from 'antd';

message.config({
    top: 80,
    duration: 2,
    maxCount: 1,
});
const { Title } = Typography;

const serverUrl = "http://localhost:3001/";

class EditPassword extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            current:"",
            currentHelp:"",
            currentCheck:"",
            currentLoad:false,
            next:false,

            new:"",
            confirm:"",
            newHelp: "",
            newCheck: "",
            confirmHelp: "",
            confirmCheck: "",
            loading:false,
        }
    }

    checkCurrent=()=>{
        this.setState({loading:true})
        axios.post(serverUrl+"edit/checkOldPassword", {
            userid: this.props.user._id,
            password: this.state.current
        }).then((response)=> {
            this.setState({ loading: false })

            if(response.data){
                
                this.setState({next:true});
            }
            else{
                this.setState({ currentCheck:"error",currentHelp:"Wrong Password!"});

            }
        }).catch((error)=>{
            this.setState({ loading: false })
        });
    }

    update=()=>{
        if(this.state.new.length<10)
        {
            this.setState({newCheck:"error",newHelp:"Password should have atleast 10 characters!"})
            return;
        }
        else if(this.state.new!==this.state.confirm)
        {
            this.setState({ newCheck: "success", newHelp: "", confirmCheck: "error", confirmHelp: "Password Dosen't match with New Password!" })
            return;
        }
        else if (this.state.new === this.state.confirm){
            this.setState({ newCheck: "success", newHelp: "",loading:true })
            axios({
                method: 'put',
                url: 'http://localhost:3001/edit/updatePassword',
                data: {
                    userid: this.props.user._id,
                    newpassword:this.state.new
                }
            }).then(res => {
                this.setState({ loading: false });
                this.setState({ newCheck: "", newHelp: "", confirmCheck: "", confirmHelp: "" })
                if (res.data) {
                    this.setState({next:false,current:"",new:"",config:"",currentCheck:"",currentHelp:"",newCheck:"",newHelp:"",confirmCheck:"",confirmHelp:""})
                    message.success("Updated Successfully!", 2000)
                }
                else {
                    message.warning("Update Failed! Please try again after some Time.", 2000)
                }
            }).catch(e => {
                this.setState({ loading: false });
                this.setState({ newCheck: "", newHelp: "", confirmCheck: "", confirmHelp: "" })
                message.warning("Update Failed! Please try again after some Time."+e, 2000)
            });
        }
    }

    render()
    {
        return(
            <div className="bor w-100 bg-white p-3" >
                <div className="text-center p-3 pb-3">
                    <Title level={2}>Change Password</Title>
                </div>
                {!this.state.next?
                    <div className="text-center w-100 p-2 pt-3 border text-center br">
                        <p className="text-info">Enter you Current Password.</p>
                        <Form  className="ml-5 mr-5 ">
                            <Form.Item
                                hasFeedback
                                className="text-center"
                                help={this.state.currentHelp}
                                validateStatus={this.state.currentCheck}
                            >
                                <Input.Password
                                    size="default"
                                    value={this.state.current}
                                    onChange={(e) => this.setState({ current: e.target.value })}
                                    maxLength="50"
                                    minLength="10"
                                    placeholder="Current Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={this.checkCurrent}
                                    loading={this.state.loading} type="primary" shape="round "
                                    className="float-right w-25">Next</Button>
                            </Form.Item>
                        </Form>
                    </div>
                  : <Form className="p-3 border br">
                        <p className="text-info">Password should be of atleast 10 characters.</p>
                        <Form.Item
                            hasFeedback
                            className="text-center"
                            help={this.state.newHelp}
                            validateStatus={this.state.newCheck}
                        >
                            <Input.Password
                                size="default"
                                value={this.state.new}
                                onChange={(e) => this.setState({ new: e.target.value })}
                                maxLength="50"
                                placeholder="New Password"
                            />
                        </Form.Item>
                        <Form.Item
                            hasFeedback
                            className="text-center"
                            help={this.state.confirmHelp}
                            validateStatus={this.state.confirmCheck}
                        >
                            <Input.Password
                                size="default"
                                value={this.state.confirm}
                                onChange={(e) => this.setState({ confirm: e.target.value })}
                                maxLength="50"
                                placeholder="Confirm Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.update}
                                loading={this.state.loading} type="primary" shape="round "
                                className="float-right w-25">Update</Button>
                        </Form.Item>
                    </Form>}
            </div>
        )
    }
}

export default EditPassword;