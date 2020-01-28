import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Row, Col, Icon, Button, Avatar,Tabs } from 'antd';
import './Profile.css';
import '../Utilities/utilities.css';

const { TabPane } = Tabs;
//1 notifyy
//2 fanmails
//4 forwards
//3 tagged 

class Inbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            inbox:[
                {
                    type:1,
                    msg:"Welcome To AyeFan Family. Make yourself at Home @ayefan #Welcome",
                    time: "3 Days Ago"
                },
                {
                    //fan mails
                    type:2,
                    verified: true,
                    msg:"Hello i'm your biggest fan. Please Reply me. Thank you. Your Biggest fan @moknla",
                    avatar:"https://cdn.pinkvilla.com/files/styles/contentpreview/public/iron-man-phase-4_0.jpg?itok=5eZBUTV1",
                    by:"montas",
                    time: "3 Days Ago",
                    reply:[]
                },
                {
                    type:3,
                    by:"srx",
                    verified: true,
                    avatar:"https://cdn.pinkvilla.com/files/styles/contentpreview/public/iron-man-phase-4_0.jpg?itok=5eZBUTV1",
                    post: {
                        postid: "",
                        reactionsNo: 25468,
                        username:"selelna",
                        verified:false,
                        avatar:"https://imagevars.gulfnews.com/2017/3/29/1_16a08425455.2002580_3642912657_16a08425455_large.jpg",
                        type: 2,
                        photo:
                            "https://www.nme.com/wp-content/uploads/2019/10/robert-downey-jr-dolittle-universal-pictures-youtube@2000x1270.jpg",
                        time: "5hr ago",
                        streams: 126547,
                    },
                    time:"3 Days Ago",
                    
                },
                {
                    type:4,
                    by:"srx",
                    verified: true,
                    avatar: "https://cdn.pinkvilla.com/files/styles/contentpreview/public/iron-man-phase-4_0.jpg?itok=5eZBUTV1",
                    msg: "Hey check this out. It is Open now.  @srx check this out.Its Awesome.",
                    post: {
                        username:"selenagomez",
                        postid: "",
                        verified:true,
                        reactionsNo: 25468,
                        avatar:"https://media.allure.com/photos/5cdb2dea350dae2155a6579d/1:1/w_2461,h_2461,c_limit/selena%20gomez.jpg",
                        type: 2,
                        photo:
                            "https://www.nme.com/wp-content/uploads/2019/10/robert-downey-jr-dolittle-universal-pictures-youtube@2000x1270.jpg",
                        time: "5hr ago",
                        streams: 126547,
                    },
                    time: "3 Days Ago"
                },
                {
                    type: 4,
                    by: "srx",
                    verified: true,
                    avatar: "https://cdn.pinkvilla.com/files/styles/contentpreview/public/iron-man-phase-4_0.jpg?itok=5eZBUTV1",
                    msg: "Hey check this out. It is Open now.  @srx check this out.Its Awesome.",
                    post: {
                        postid: "",
                        reactionsNo: 25468,
                        verified:true,
                        username:"selenagomez",
                        avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv6t-GabxtReuGN8smIdQaFEmmo9Eg1HtA6AN0Z2eVIXaGUSrI&s",
                        type: 1,
                       text:"Ona train to a @japan, i keep her reallay close cause see #knoes who i am.",
                        time: "5hr ago",
                        streams: 126547,
                    },
                    time: "3 Days Ago"
                }
            ]
        }
    }

    sendReply=()=>{
        alert("send")
    }

    numberToWord = (x) => {
        if (String(x).length > 9) {
            return String(parseInt(x / 1000000000)) + "B";
        }
        else if (String(x).length > 6) {
            return String(parseInt(x / 1000000)) + "M";
        }
        else if (String(x).length > 3) {
            return String(parseInt(x / 1000)) + "K";
        }
        else {
            return String(x)
        }
    }
    tagColor = (text) => {
        let temp = text.split(" ");
        var result = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i][0] === '@') {
                var a = temp[i];
                result.push(" ");
                result.push(<Link to={'/profile/' + a.slice(1,a.length)}><span style={{ cursor: 'pointer' }} >{a}</span></Link>);
            }
            else if (temp[i][0] === '#') {
                var a1 = temp[i];
                result.push(" ");
                result.push(<Link to={'/tag/' + a1.slice(1, a1.length)}><span style={{ cursor: 'pointer' }}>{a1}</span></Link>);
            }
            else if (temp[i][0] === '&') {
                var a2 = temp[i];
                result.push(" ");
                result.push(<Link to={'/group/' + a2.slice(1,a2.length)}><span style={{ cursor: 'pointer' }}>{a2}</span></Link>);
            }
            else {
                result.push(" ");
                result.push(<span style={{ color: 'black' }}>{temp[i]}</span>);
            }
        }
        return result;
    }

    render() {
        return (
          <div>
            <Row type="flex" justify="center">
              <Col span={5}></Col>
              <Col span={14}>
                <div className=" bg-light br p-3">
                  <Tabs tabPosition="left">
                    <TabPane tab="Fan-Mails" key="2">
                      <div
                        style={{
                          height: "700px",
                          overflowX: "hidden",
                          overflowY: "scroll"
                        }}
                      >
                        {this.state.inbox.map(obj => {
                          if (obj.type === 2) {
                            return (
                              <Row className="m-2 bg-white border br">
                                <div className="pr-3  pl-3 pt-3 text-left">
                                  <Link to={"/profile/" + obj.by}>
                                    <span className="d-inline">
                                      <Avatar
                                        src={obj.avatar}
                                        style={{
                                          height: "70px",
                                          width: "70px"
                                        }}
                                      />
                                    </span>
                                    <span
                                      style={{
                                        fontWeight: "500",
                                        fontSize: "1.2rem"
                                      }}
                                      className="d-inline pl-2 myblue"
                                    >
                                      {"@" + obj.by}{" "}
                                      {obj.verfied ? (
                                        <span
                                          style={{
                                            fontSize: "1rem",
                                            fontWeight: "900"
                                          }}
                                        >
                                          <Icon
                                            type="check-circle"
                                            theme="filled"
                                          />
                                        </span>
                                      ) : null}
                                    </span>
                                  </Link>

                                  <span className="d-inline-break gry float-right pr-3">
                                    {obj.time}
                                  </span>
                                </div>
                                <div
                                  className=" text-break text-left"
                                  style={{
                                    marginTop: "-20px",
                                    paddingLeft: "100px",
                                    fontWeight: "500",
                                    fontSize: "1rem"
                                  }}
                                >
                                  {this.tagColor(obj.msg)}
                                </div>
                                <div>
                                    
                                </div>
                                <div
                                  onClick={() =>
                                    this.setState({ visible: true })
                                  }
                                  style={{
                                    fontWeight: "500",
                                    fontSize: "1.5rem"
                                  }}
                                  className="d-inline-break myblue cur float-right p-3"
                                >
                                  <Icon type="message" theme="filled" /> reply
                                </div>
                              </Row>
                            );
                          }
                        })}
                      </div>
                    </TabPane>
                    <TabPane tab="Notifications" key="1">
                      <div
                        style={{
                          height: "700px",
                          overflowX: "hidden",
                          overflowY: "scroll"
                        }}
                      >
                        {this.state.inbox.map(obj => {
                          if (obj.type === 1) {
                            return (
                              <Row className="m-2 bg-white text-center mr-4 mt-3   border br">
                                <p className=" float-right gry p-3 pr-4">
                                  {" "}
                                  {obj.time}
                                </p>

                                <div
                                  className="m-4 text-break "
                                  style={{
                                    fontWeight: "500",
                                    fontSize: "1.1rem"
                                  }}
                                >
                                  {this.tagColor(obj.msg)}
                                </div>
                              </Row>
                            );
                          }
                        })}
                      </div>
                    </TabPane>
                    <TabPane tab="Forwards | Tags" key="3">
                      <div
                        style={{
                          height: "700px",
                          overflowX: "hidden",
                          overflowY: "scroll"
                        }}
                      >
                        {this.state.inbox.map(obj => {
                          if (obj.type === 4 || obj.type === 3) {
                            return (
                              <Row className="m-2 mr-4 mt-3    border bg-white  br">
                                <div className=" float-right gry p-3 pr-4">
                                  {" "}
                                  {obj.time}
                                </div>
                                <div className="pr-3 pl-3 pt-3 text-left">
                                  <Link to={"/profile/" + obj.by}>
                                    <div>
                                      <span className="d-inline">
                                        <Avatar
                                          src={obj.avatar}
                                          style={{
                                            height: "70px",
                                            width: "70px"
                                          }}
                                        />
                                      </span>
                                      <span
                                        style={{
                                          fontWeight: "500",
                                          fontSize: "1.2rem"
                                        }}
                                        className="d-inline pl-2 myblue"
                                      >
                                        {"@" + obj.by}{" "}
                                        {obj.verified ? (
                                          <span
                                            style={{
                                              fontSize: "1.1rem",
                                              fontWeight: "900"
                                            }}
                                          >
                                            <Icon
                                              type="check-circle"
                                              theme="filled"
                                            />{" "}
                                          </span>
                                        ) : null}
                                      </span>
                                      {obj.type === 3 ? (
                                        <span
                                          className="pl-1 text-dark"
                                          style={{
                                            fontWeight: "500",
                                            fontSize: "1rem"
                                          }}
                                        >
                                          tagged you in this post.
                                        </span>
                                      ) : null}
                                    </div>
                                  </Link>
                                </div>
                                {obj.type === 4 ? (
                                  <div
                                    className="text-left"
                                    style={{
                                      fontWeight: "500",
                                      marginTop: "-25px",
                                      paddingLeft: "98px",
                                      fontSize: "1rem"
                                    }}
                                  >
                                    {this.tagColor(obj.msg)}{" "}
                                  </div>
                                ) : null}

                                <div
                                  className="pb-3 text-break text-left"
                                  style={{
                                    paddingLeft: "95px",
                                    marginTop: "10px",
                                    fontWeight: "500",
                                    fontSize: "1rem"
                                  }}
                                >
                                  {obj.type === 3 ? (
                                    <hr
                                      className="mr-4 "
                                      style={{ marginTop: "-15px" }}
                                    ></hr>
                                  ) : null}
                                  <div>
                                    {obj.type === 4 ? (
                                      <hr className="mr-4 "></hr>
                                    ) : null}
                                    <Link to={"/profile/" + obj.post.username}>
                                      <div>
                                        <span className="d-inline">
                                          <Avatar
                                            src={obj.post.avatar}
                                            style={{
                                              height: "50px",
                                              width: "50px"
                                            }}
                                          />
                                        </span>
                                        <span
                                          style={{
                                            fontWeight: "500",
                                            fontSize: "1.2rem"
                                          }}
                                          className="d-inline pl-2 myblue"
                                        >
                                          {"@" + obj.post.username}{" "}
                                          {obj.post.verified ? (
                                            <span
                                              style={{
                                                fontSize: "1.1rem",
                                                fontWeight: "900"
                                              }}
                                            >
                                              <Icon
                                                type="check-circle"
                                                theme="filled"
                                              />
                                            </span>
                                          ) : null}
                                          <span className="p-1">&bull;</span>
                                          <span
                                            className="gry pl-1"
                                            style={{
                                              fontSize: "1rem",
                                              fontWeight: "400"
                                            }}
                                          >
                                            {obj.post.time}
                                          </span>
                                        </span>
                                      </div>
                                    </Link>
                                    <Link to={"/posts/" + obj.post.postid}>
                                      {obj.post.type !== 1 ? (
                                        <div className="thumbnail1  text-left cur con  faded">
                                          <div>
                                            <img
                                              src={obj.post.photo}
                                              className="faded"
                                              alt="Image"
                                            />
                                            <div
                                              class="text-block11 glass p-2 pr-3"
                                              style={{
                                                Radius: "0px 15px 15px 0px"
                                              }}
                                            >
                                              <div className="d-inline-block pr-4 ">
                                                <h6 className="text-white">
                                                  {this.numberToWord(
                                                    obj.post.streams
                                                  )}
                                                </h6>
                                                <p style={{ fontSize: "1rem" }}>
                                                  Streams
                                                </p>
                                              </div>
                                              <div className="d-inline-block ">
                                                <h6 className="text-white">
                                                  {this.numberToWord(
                                                    obj.post.reactionsNo
                                                  )}
                                                </h6>
                                                <p style={{ fontSize: "1rem" }}>
                                                  Reactions
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="  text-left cur con  faded">
                                          <div>
                                            <div
                                              className="p-2"
                                              style={{
                                                fontWeight: "500",
                                                fontSize: "1.4rem"
                                              }}
                                            >
                                              <div
                                                style={{ margin: "15px" }}
                                                className="border p-3 br"
                                              >
                                                {this.tagColor(obj.post.text)}
                                                <div
                                                  class="w-25 glass mt-1 p-2 pb-4 pt-1 "
                                                  style={{
                                                    borderRadius:
                                                      "0px 15px 15px 0px",
                                                    marginLeft: "-17px"
                                                  }}
                                                >
                                                  <div className="pl-2 d-inline-block  ">
                                                    <h6 className="text-white">
                                                      {this.numberToWord(
                                                        obj.post.streams
                                                      )}
                                                    </h6>
                                                    <p
                                                      style={{
                                                        fontSize: "1rem"
                                                      }}
                                                    >
                                                      Streams
                                                    </p>
                                                  </div>
                                                  <div className="d-inline-block pl-2">
                                                    <h6 className="text-white">
                                                      {this.numberToWord(
                                                        obj.post.reactionsNo
                                                      )}
                                                    </h6>
                                                    <p
                                                      style={{
                                                        fontSize: "1rem"
                                                      }}
                                                    >
                                                      Reactions
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Link>
                                  </div>
                                </div>
                              </Row>
                            );
                          }
                        })}
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
              </Col>
              <Col span={5}></Col>
            </Row>
            <Row>
              <Col xs={24} style={{ height: "55px" }}></Col>
            </Row>
          </div>
        );
    }
}


export default Inbox;