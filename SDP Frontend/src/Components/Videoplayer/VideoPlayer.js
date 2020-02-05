import React from 'react';
import "./videoplayer.css";
import ReactPlayer from 'react-player'

class VideoPlayer extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            play:this.props.play
        }
    }

    play=()=>{
        this.setState({play:true});
    }

    pause=()=>{
        this.setState({play:false});
    }

    render()
    {
        return (
          <div className=" text-center">
            <video preload={true} className="nolink" controls autoPlay={this.state.play} disablePictureInPicture controlsList="nodownload">
              <source src={this.props.video} type="video/mp4" />
              <source src={this.props.video} type="video/ogg" />
            </video>
          </div>
        );
    }
}

export default VideoPlayer;