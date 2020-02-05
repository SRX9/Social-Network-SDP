import React from 'react';
import "./videoplayer.css";

import "video-react/dist/video-react.css";
import { Player,BigPlayButton,ControlBar,LoadingSpinner,VolumeMenuButton, Shortcut } from 'video-react';
import { Button } from 'antd';

class CoverVideo extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={

        }
    }

    render()
    {
        return(<div className="modalcover">
            <Player
                playsInline
                className="modalcover"
                autoPlay
                poster="/assets/poster.png"
                src={this.props.video}
            >
                <Shortcut clickable={true}  />
                <LoadingSpinner />
                <VolumeMenuButton disabled />

                <ControlBar autoHide={true} autoHideTime={true}>
                </ControlBar>
                <BigPlayButton position="center" />
            </Player>
        </div>);
    }
}

export default CoverVideo;