import React from 'react';
import '../App.css';
import {Link,withRouter} from 'react-router-dom';

class Main extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={

        }
    }

    render()
    {
        return(
            <div>
                <h1>Welcome To Ayefan</h1>
                <Link to="/signin">Signin</Link>
            </div>
        )
    }
}

export default withRouter(Main);