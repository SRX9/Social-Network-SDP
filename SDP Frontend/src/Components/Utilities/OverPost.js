import React from 'react';
import {Link} from 'react-router-dom';
import './utilities.css';
import { MdSlowMotionVideo, MdAudiotrack } from "react-icons/md";
import { IoMdImage } from "react-icons/io";
import { Avatar } from 'antd';


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
    tagColor=(text)=> {
    let temp = text.split(" ");
    var result = [];
    for (var i = 0; i < temp.length; i++) {
        if (temp[i][0] === '@') {
            var a = temp[i];
            result.push(" ");
            result.push(<Link to={'/profile/' + a}><span style={{ cursor: 'pointer' }} >{a}</span></Link>);
        }
        else if (temp[i][0] === '#') {
            var a1 = temp[i];
            result.push(" ");
            result.push(<Link to={'/tag/' + a1}><span style={{ cursor: 'pointer' }}>{a1}</span></Link>);
        }
        else if (temp[i][0] === '&') {
            var a2 = temp[i];
            result.push(" ");
            result.push(<Link to={'/group/' + a2}><span style={{ cursor: 'pointer' }}>{a2}</span></Link>);
        }
        else {
            result.push(" ");
            result.push(<span style={{ color: 'black' }}>{temp[i]}</span>);
        }
    }
    return result;
    }

    render()
    {
        if(this.props.obj.type===1)
        {
            return (
              <div
                style={{ height: "350px", width: "100%" }}
                className="br cur  faded  w-100  border text-left overflow-hidden "
              >
                <p
                  style={{ fontSize: "1.1rem", fontWeight: "500" }}
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
                    <p style={{ fontSize: "1rem" }}>Streams</p>
                  </div>
                  <div className="d-inline-block text-center">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.reactionsNo)}
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
                <img src={this.props.obj.photo} className="faded" alt="Image" />
                <div
                  class="text-block glass p-2 pr-3"
                  style={{ borderRadius: "0px 15px 15px 0px" }}
                >
                  <div className="d-inline-block pr-4 ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.streams)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Streams</p>
                  </div>
                  <div className="d-inline-block ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.reactionsNo)}
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
                  src={this.props.obj.video + "#t=5"}
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
                    <p style={{ fontSize: "1rem" }}>Streams</p>
                  </div>
                  <div className="d-inline-block ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.reactionsNo)}
                    </h6>
                    <p style={{ fontSize: "1rem" }}>Reactions</p>
                  </div>
                </div>
              </div>
            );
        }
        else if (this.props.obj.type === 4) {
            return (
              <div className="thumbnail faded bg-light cur border ">
                <img src={this.props.obj.photo} className="faded" alt="Image" />
                <div className="text-blockt">
                  <MdAudiotrack
                    className="iconshad"
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
                    <p style={{ fontSize: "1rem" }}>Streams</p>
                  </div>
                  <div className="d-inline-block ">
                    <h6 className="text-white">
                      {this.numberToWord(this.props.obj.reactionsNo)}
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