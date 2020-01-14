import React from 'react';
import './Profile.css';

class Profile extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            username: this.props.match.params.username
        }
    }

    render()
    {
        return(
            <div>
                {this.state.username}
            </div>
        );
    }
}

export default Profile;