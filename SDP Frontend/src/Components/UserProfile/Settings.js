import React from 'react';
import './Profile.css';
import { Tabs,Input } from 'antd';
import EditUser from '../EditComponents/EditUser';
import Editcontact from '../EditComponents/Editcontact';
import EditPassword from '../EditComponents/EditPassword';

const { TabPane } = Tabs;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};

class Settings extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={

        }
    }

    updateUser=(obj)=>{
        this.props.updateUser(obj);
    }

    render()
    {
        return(
            <div className="bor bg-white p-3" style={{width:"55vw"}}>
                <Tabs tabPosition="left" defaultActiveKey="1" >
                    <TabPane tab="Edit Profile " key="1">
                      <EditUser updateUser={this.updateUser} user={this.props.user} />
                    </TabPane>
                    <TabPane tab="Change Contact Details" key="2">
                       <Editcontact updateUser={this.updateUser} user={this.props.user}/>
                    </TabPane>
                    <TabPane tab="Change Password" key="3">
                        <EditPassword user={this.props.user}/>
                    </TabPane>
                    <TabPane tab="Account Privacy" key="4">
                        Content of Tab 3
                    </TabPane>

                </Tabs>
            </div>
        )
    }
}

export default Settings;