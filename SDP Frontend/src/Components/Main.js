import React from 'react';
import '../App.css';
import {Link,withRouter} from 'react-router-dom';
import {Title} from 'antd';
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
            <div className="text-center w-100 m-5 p-5"> 
                <h1 className="display-1">Welcome To 
                <div className="myfont mt-5">
                    ayefan
                </div></h1>
            </div>
        )
    }
}

export default withRouter(Main);