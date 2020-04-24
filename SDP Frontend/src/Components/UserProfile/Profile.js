import React from 'react';
import axios from 'axios';
import { Row, Col, Tabs, Icon, Button, Avatar, message} from 'antd';
import DashBoard from './Dashboard';
import Posts from './Posts';
import Inbox from './Inbox';
import Story from './Story';
import './Profile.css';
import Drawer from 'react-drag-drawer'
import CoverVideo from '../Videoplayer/CoverVideo';
import ChangeCover from '../EditComponents/ChangeCover';
import Settings from './Settings';

/***************** onchagne username url should change */

const { TabPane } = Tabs;
const serverUrl = "http://localhost:3001/";
class Profile extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            fanornot:false,

            //covervideo
            covervideo:false,

            //change cover
            coverchange:false,

            //settings
            setting:false,

            userObj:null,
            loading:true,
            exist:true,
            error:"",
            errorFlag:false,

            homeornot:false,

            //fan in and out
            fan:false,
            fanloading:false
        }
    }

    fanornot=(id)=>{
      axios.get(`${serverUrl}data/fanornot?user=${localStorage.getItem("$#@!")}&star=${id}`)
        .then((response) => {
            this.setState({ fan: response.data})
        })
    }
    componentWillMount()
    {
      if (localStorage.getItem("!@#$") !== undefined) {
        this.props.loadOn();
        axios.get(`${serverUrl}data/getUserProfile?username=${this.props.match.params.username}`)
          .then((response) => {
            this.props.loadOff();
            if (response.data !== false) {
              this.setState({ loading: false, userObj: response.data, homeornot: localStorage.getItem('$#@!') === response.data._id }, () => {
                this.props.getUserObj(response.data);
                this.fanornot(response.data._id);

              });
            }
            else {
              this.setState({ exist: false });
            }
          }).catch(error => {
            this.props.loadOff();
            this.setState({ errorFlag: true, error: "Server Down! Please try again later. We are sorry for inconvinency." })
          });
      }
      else {
        this.props.history.push(`/signin`);
      }

    }
    componentDidUpdate = (prevProps) => {
      if (this.props.match.params.username !== prevProps.match.params.username) {
        this.props.loadOn();
        axios.get(`${serverUrl}data/getUserProfile?username=${this.props.match.params.username}`)
          .then((response) => {
            this.props.loadOff();
            this.fanornot();
            if (response.data !== false) {
              this.fanornot(response.data._id);

              this.setState({ loading: false, userObj: response.data, homeornot: localStorage.getItem('$#@!') === response.data._id }, () => {
              });
            }
            else {
              this.setState({ exist: false });
            }
          }).catch(error => {
            this.props.loadOff();
            this.setState({ errorFlag: true, error: "Server Down! Please try again later. We are sorry for inconvinency." })
          });
      };
    }
    componentDidMount()
    {
      console.log(this.state.userObj,localStorage.getItem('$#@!'),"\n",this.state.homeornot)
    }
    //change cover photo
    changeCoverPhoto=(path)=>{
        let temp=this.state.userObj;
        temp.coverPhoto=path;
        this.setState({userObj:temp});
    }
    //change cover video
    changeCoverVideo=(path)=>{
        let temp=this.state.userObj;
        temp.coverVideo=path;
        this.setState({userObj:temp});
    }

    updateUser=(obj)=>{
      if (localStorage.getItem("!@#$")!==undefined)
      {
        localStorage.setItem("!@#$",obj.username);
      }
      this.setState({userObj:obj});
    }

    //Fan in
    fanin=()=>{
      axios({
        method: 'put',
        url: serverUrl + "network/fanin",
        data: {
          star: this.state.userObj._id,
          fan: localStorage.getItem('$#@!')
        }
      }).then( (response)=> {
        if(response.data)
        {
          let temp = this.state.userObj;
          temp.fans++;
          this.setState({ fanloading: false, fan: true, userObj: temp });
        }
        else{
          this.setState({ fanloading: false });
          message.warning("Server Problem Fan-ing in!! Plz Try Again Later.");
        }

      }).catch(e=>{
        this.setState({fanloading:false});
        message.warning("Server Problem Fan-ing in!! Plz Try Again Later.");
      });
    }

    fanout=()=>{
      axios({
        method: 'put',
        url: serverUrl + "network/fanout",
        data: {
          star: this.state.userObj._id,
          fan: localStorage.getItem('$#@!')
        }
      }).then((response) => {
        if(response.data)
        {
          let temp = this.state.userObj;
          temp.fans--;
          this.setState({ fanloading: false, fan: false, userObj: temp });
        }
        else{
          this.setState({ fanloading: false });
          message.warning("Server Error Fan-ing out!! Plz Try Again Later.");
        }
      }).catch(e => {
        this.setState({ fanloading: false });
        message.warning("Server Error Fan-ing out!! Plz Try Again Later.");
      });
    }

    logout=()=>{
      localStorage.removeItem('!@#$');
      localStorage.removeItem('$#@!');
      this.props.logOut();
      this.props.history.push(`/signin`);
      
    }

    render()
    {
        if(this.state.loading)
        {
            return (
                <div>
                    loading
                </div>
            );
        }
        else if(this.state.userObj.username===undefined)
        {
         return  <h1 className="display-1 text-center">No Such Star Found.</h1>
        }
        else{
            return (
              <div className="style-1 stopscroll">
                <div
                
                  className="layer"
                  style={{
                    
                    backgroundImage: `url(${this.state.userObj.coverPhoto === "" ? "http://localhost:3001/cover.png" : this.state.userObj.coverPhoto})`,
                    backgroundSize: "cover",
                    height: "84vh",
                    width: "100%",
                    backgroundPosition: "center"
                  }}
                >
                  <Row align="center">
                    <div className="">
                      <Row className="">
                        <Col flex="auto" className="bg-transparent text-left pl-2" span={9}>
                          <Button
                            shape="circle"
                            size="default"
                            type="default"
                            onClick={() => this.setState({ covervideo: true })}
                            className="mt-2 mr-3 d-inline    btn"
                            style={{ border: "5px solid white" }}
                          >
                            <Icon type="video-camera" />
                          </Button>
                          {this.state.homeornot?
                            <Button
                              shape="round"
                              type="primary"
                              size="default"
                              onClick={() => this.setState({ coverchange: true })}
                              className="mt-2 mr-3 d-inline    btn"
                            >
                              <Icon type="edit"  /> Change Cover
                          </Button>
                          :null}

                        </Col>
                        <Col flex="auto" className="text-center">
                              <div
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "600",
                                }}
                                className="text-dark p-1 shadow-4 pronav fixed-top ayefan"
                              >
                                ayefan
                              </div>
                        </Col>
                        <Col flex="auto" className="bg-transparent float-right text-right" span={9} >
                                {this.state.homeornot?
                            <div>
                              <Button
                                shape="round"
                                size="default"
                                type="danger"
                                onClick={this.logout}
                                className="mt-2 mr-2 d-inline  float-right  btn"
                              >
                                Logout
                          </Button>
                              <Button
                                shape="round"
                                size="default"
                                type="default"
                                onClick={() => this.setState({ setting: true })}
                                className="mt-2 mr-3 d-inline  float-right  btn"
                              >
                                <Icon type="setting" /> Settings
                          </Button>

                              </div> :null}
  
                        </Col>
                      </Row>
                    </div>
                  </Row>
                </div>
                <div
                  className="bg-white layer"
                  style={{
                    position: "absolute",
                    height: "100px",
                    width: "100%"
                  }}
                >
                  <div class="row justify-content-md-center" style={{marginLeft:"-48px"}}>
                    <div class="col col-lg-2 text-right" style={{ paddingTop: "7px" }}
                    >
                      <div className="w-50 float-right" style={{marginRight:"-45px"}}>
                        {this.state.userObj._id !== localStorage.getItem('$#@!') ?<div
                          className="cur pb-1 text-center"
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "500",
                            paddingTop: "px"
                          }}
                        >
                          {this.state.userObj.fans}
                          <span
                            className="gry"
                            style={{ fontSize: "1.4rem", fontWeight: "400" }}
                          >
                            {" "}
                            fans
                          </span>
                        </div> : 
                        <div>
                            <div
                              className="cur pt-3  text-center"
                              style={{
                                fontSize: "230%",
                                fontWeight: "500",
                                paddingTop: "px"
                              }}
                            >
                              {this.state.userObj.fans} fans
                            </div>
                          </div>}
                        {this.state.userObj._id!==localStorage.getItem('$#@!')?
                        !this.state.fan?<Button type="primary" loading={this.state.fanloading} onClick={this.fanin} className="w-100" shape="round">
                          Fan-in
                        </Button> : 
                        <Button type="default" 
                            onClick={this.fanout} loading={this.state.fanloading} className="w-100" shape="round">
                           &#10003; Fan-out
                        </Button>:null}
                      </div>
                    </div>
                    <div class="col-md-auto">
                      <Avatar
                        className="text-center"
                        style={{
                          border: "10px solid white",
                          height: "250px",
                          width: "250px",
                          top: "-150px"
                        }}
                        size="default"
                        src={this.state.userObj.avatar === "" ? "http://localhost:3001/AF.png" : this.state.userObj.avatar}
                      />
                    </div>
                    <div class="col col-lg-2  pt-2" style={{ marginLeft: "-35px" }}>
                      <div className=" text-left" >
                        <span
                          className=" myblue"
                          style={{ fontSize: "340%", fontWeight: "600" }}
                        >
                          {this.state.userObj.username}    
                
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="" style={{ marginTop: "105px", paddingBottom: "50px" }}>

                  <Tabs
                    size="default"
                    defaultActiveKey="1"
                    style={{ textAlign: "center" }}
                  >
                    <TabPane tab="DashBoard" key="1">
                      <DashBoard obj={this.state.userObj} />
                    </TabPane>
                    <TabPane tab="Posts" key="2">
                      <Posts  userid={this.state.userObj.username} />
                    </TabPane>
                    {/*<TabPane tab="Inbox" key="3">
                      <Inbox obj={this.state.userObj} />
                    </TabPane>
                    <TabPane tab="Story" key="4">
                      <Story story={this.state.userObj.story} />
                      </TabPane>*/}
                  </Tabs>
                </div>
                <Drawer
                  open={this.state.covervideo}
                  onRequestClose={()=>this.setState({covervideo:false})}
                  modalElementClass=""
                >
                  <CoverVideo video={this.state.userObj.coverVideo === "" ? "https://cdn.videvo.net/videvo_files/converted/2018_01/preview/171124_H1_005.mp436952.webm" : this.state.userObj.coverVideo}/>
                </Drawer>
                <Drawer
                  open={this.state.coverchange}
                  onRequestClose={() => this.setState({ coverchange: false })}
                  modalElementClass=""
                >
                  <ChangeCover changeVideo={this.changeCoverVideo} changePhoto={this.changeCoverPhoto} user={this.state.userObj}/>
                </Drawer>
                <Drawer
                  open={this.state.setting }
                  onRequestClose={() => this.setState({ setting: false })}
                  modalElementClass=""
                >
                  <Settings updateUser={this.updateUser} user={this.state.userObj}/>
                </Drawer>
              </div>
            );
        }

    }
}

export default Profile; 