import React from 'react';
import axios from 'axios';
import OverPost from '../Utilities/OverPost';
import { Row, Col, Tabs, Icon, Button, Avatar } from 'antd';
import './Profile.css';

//1 text
//2 photo
//3 video
//4 audio

class Posts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          userid: this.props.userid,
          posts: [
            {
              postid: "",
              reactionsNo: 25468,
              type: 2,
              photo:
                "https://www.screengeek.net/wp-content/uploads/2019/09/robert-downey-jr-iron-man-tony-stark.jpg",
              text:
                "I becomame animal whisperer @dr. #Dolittle – watch the from &joerusso ‘Dolittle’ trailer",
              time: new Date(),
              streams: 126547,
              reactions: [
                {
                  postid: "asdasdasd",
                  userid: "asdasdasd",
                  username: "srx",
                  avatar:
                    "https://secure-journal.hautehorlogerie.org/wp-content/uploads/2019/06/Robert-Downey-Jr-d.jpg",
                  text: "Awesome #dude",
                  reaction: 1,
                  reply: [
                    {
                      postid: "asdasdasd",
                      userid: "asdasdasd",
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg",
                      text: "Tatally Agree with you"
                    }
                  ],
                  like: [
                    {
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg"
                    }
                  ]
                }
              ]
            },
            {
              postid: "",
              reactionsNo: 125468,
              type: 1,
              text:
                "Thank you Indonesia, India, Colombia, Central America, Peru, Thailand, Singapore, Ecuador, and Bolivia for opening @DolittleMovie at #1!",
              time: new Date(),
              streams: 27547,
              reactions: [
                {
                  postid: "asdasdasd",
                  userid: "asdasdasd",
                  username: "srx",
                  avatar:
                    "https://secure-journal.hautehorlogerie.org/wp-content/uploads/2019/06/Robert-Downey-Jr-d.jpg",
                  text: "Awesome #dude",
                  reaction: 1,
                  reply: [
                    {
                      postid: "asdasdasd",
                      userid: "asdasdasd",
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg",
                      text: "Tatally Agree with you"
                    }
                  ],
                  like: [
                    {
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg"
                    }
                  ]
                }
              ]
            },
            {
              postid: "",
              reactionsNo: 125468,
              type: 2,
              photo:
                "https://www.nme.com/wp-content/uploads/2019/10/robert-downey-jr-dolittle-universal-pictures-youtube@2000x1270.jpg",
              text:
                "I becomame animal whisperer @dr. #Dolittle – watch the from &joerusso ‘Dolittle’ trailer",
              time: new Date(),
              streams: 126547,
              reactions: [
                {
                  postid: "asdasdasd",
                  userid: "asdasdasd",
                  username: "srx",
                  avatar:
                    "https://secure-journal.hautehorlogerie.org/wp-content/uploads/2019/06/Robert-Downey-Jr-d.jpg",
                  text: "Awesome #dude",
                  reaction: 1,
                  reply: [
                    {
                      postid: "asdasdasd",
                      userid: "asdasdasd",
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg",
                      text: "Tatally Agree with you"
                    }
                  ],
                  like: [
                    {
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg"
                    }
                  ]
                }
              ]
            },
            {
              postid: "",
              reactionsNo: 125468,
              type: 3,
              video:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              text:
                "I becomame animal whisperer @dr. #Dolittle – watch the from &joerusso ‘Dolittle’ trailer",
              time: new Date(),
              streams: 7856547,
              reactions: [
                {
                  postid: "asdasdasd",
                  userid: "asdasdasd",
                  username: "srx",
                  avatar:
                    "https://secure-journal.hautehorlogerie.org/wp-content/uploads/2019/06/Robert-Downey-Jr-d.jpg",
                  text: "Awesome #dude",
                  reaction: 1,
                  reply: [
                    {
                      postid: "asdasdasd",
                      userid: "asdasdasd",
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg",
                      text: "Tatally Agree with you"
                    }
                  ],
                  like: [
                    {
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg"
                    }
                  ]
                }
              ]
            },
            {
              postid: "",
              reactionsNo: 125468,
              type: 4,
              avatar:
                "https://imagevars.gulfnews.com/2017/3/29/1_16a08425455.2002580_3642912657_16a08425455_large.jpg",
              photo:
                "https://los40.cl/wp-content/uploads/2010/07/19-actualidad-1279550100_329270_1279626300_noticia_normal.jpg",
              audio:
                "https://ypvnxx00-a.akamaihd.net/downloads/ringtones/files/mp3/ringtone-48822.mp3",
              text:
                "I becomame animal whisperer @dr. #Dolittle – watch the from &joerusso ‘Dolittle’ trailer",
              time: new Date(),
              streams: 126547,
              reactions: [
                {
                  postid: "asdasdasd",
                  userid: "asdasdasd",
                  username: "srx",
                  avatar:
                    "https://secure-journal.hautehorlogerie.org/wp-content/uploads/2019/06/Robert-Downey-Jr-d.jpg",
                  text: "Awesome #dude",
                  reaction: 1,
                  reply: [
                    {
                      postid: "asdasdasd",
                      userid: "asdasdasd",
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg",
                      text: "Tatally Agree with you"
                    }
                  ],
                  like: [
                    {
                      username: "srx",
                      avatar:
                        "https://i.pinimg.com/originals/b5/fe/8b/b5fe8bb388643ba1e3d78431064eab0e.jpg"
                    }
                  ]
                }
              ]
            },
          ]
        };
    }


    render() {
        return (
            <div>
                <Row className="text-center pb-5 mb-5  p-3" justify="center">
                    <Col span={1}>
                    </Col>
                    <Col span={22}>
                        <Row gutter={[16, 16]} className="border-0">
                            {this.state.posts.map(obj =>
                                <Col span={6} >
                                    <OverPost obj={obj} />
                                </Col>
                            )}
                        </Row>
                    </Col>
                    <Col span={1}>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ height: "200px" }}></Col>
                </Row>
            </div>

        );
    }
}


export default Posts;