import React from 'react';
import {Link} from 'react-router-dom';
import './utilities.css';
import { MdSlowMotionVideo, MdAudiotrack } from "react-icons/md";
import { IoMdImage } from "react-icons/io";
import { Avatar } from 'antd';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const server = "http://localhost:3001/";
class OverPost extends React.Component
{
    constructor(props)
    {
        super(props);
        this.props={

        }
    }

    numberToWord=(x) =>{
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
    let temp = text.split("\n").join(" ").split(" ");
    var result = [];
    for (var i = 0; i < temp.length; i++) {
      if (temp[i][0] !== undefined && temp[i][0].trim() === '@' && temp[i].trim().length !== 1) {
        var a = temp[i];
        result.push(" ");
        result.push(<Link to={'/profile/' + a}><span style={{ cursor: 'pointer' }} >{a}</span></Link>);
      }
      else if (temp[i][0] !== undefined && temp[i][0].trim() === '#' && temp[i].trim().length !== 1) {
        var a1 = temp[i];
        result.push(" ");
        result.push(<Link to={'/tag/' + a1}><span style={{ cursor: 'pointer' }}>{a1}</span></Link>);
      }
      else if (temp[i][0] !== undefined && temp[i][0].trim() === '&' && temp[i].trim().length !== 1) {
        var a2 = temp[i];
        result.push(" ");
        result.push(<Link to={'/group/' + a2}><span style={{ cursor: 'pointer' }}>{a2}</span></Link>);
      }
      else {
        result.push(" ");
        result.push(<span style={{ color: 'black' }}>{temp[i]}</span>);
      }
    }
    return result.slice(1, result.length);
  }

    render()
    {
        if(this.props.obj.type===1)
        {
            return (
              <div
                className="thumbnail cur con  border faded text-left"
              >
                <p
                  style={{ fontSize: "1.2rem", fontWeight: "500" }}
                  className="p-4"
                >
                  {this.tagColor(this.props.obj.text)}
                </p>

                <div
                  class="textBot text-white glass pr-3 p-2"
                  style={{ borderRadius: "0px 15px 15px 0px" }}
                >
                  <div className="d-inline-block text-center pr-4 ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.streams)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Stans</p>
                  </div>
                  <div className="d-inline-block text-center">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.reactionNo)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Reactions</p>
                  </div>
                </div>
              </div>
            );
        }
        else if (this.props.obj.type === 2)
        {
            return (
              <div className="thumbnail cur con  border faded">
                <img src={this.props.obj.photosLink[0]} 
                className="faded" alt="Image" />
                <div
                  class="text-block glass p-2 pr-3"
                  style={{ borderRadius: "0px 15px 15px 0px" }}
                >
                  <div className="d-inline-block pr-4 ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.streams)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Stans</p>
                  </div>
                  <div className="d-inline-block ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.reactionNo)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Reactions</p>
                  </div>
                </div>
              </div>
            );
        }
        else if (this.props.obj.type === 3) {
            return (
              <div className="thumbnail faded cur ">
                <video
                  height="350px"
                  width="auto"
                  src={this.props.obj.videoLink}
                />
                <div className="text-blockt">
                  <MdSlowMotionVideo style={{ fontSize: "50px" }} />
                </div>
                <div
                  class="text-block glass p-2 pr-3"
                  style={{ borderRadius: "0px 15px 15px 0px" }}
                >
                  <div className="d-inline-block pr-4 ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.streams)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Stans</p>
                  </div>
                  <div className="d-inline-block ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.reactionNo)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Reactions</p>
                  </div>
                </div>
              </div>
            );
        }
        else if (this.props.obj.type === 4) {
            return (
              <div className="thumbnail  faded bg-light cur border ">
                <Avatar className={"pointer mt-1  shadow-2-l "} shape="circle" style={{
                  height: "25vh",
                  width: "25vh",
                  border: "10px solid white"
                }} src={ this.props.obj.coverLink} />
                <div className="text-blockt">
                  <MdAudiotrack
                    className="iconshad text-black-50"
                    style={{ fontSize: "50px" }}
                  />
                </div>
                <div
                  class="text-block glass p-2 pr-3"
                  style={{ borderRadius: "0px 15px 15px 0px" }}
                >
                  <div className="d-inline-block pr-4 ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.streams)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Stans</p>
                  </div>
                  <div className="d-inline-block ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.reactionNo)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Reactions</p>
                  </div>
                </div>
              </div>
            );
        }
    }
}

export default OverPost;